import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import pptxgen from 'pptxgenjs';

const OUTPUT_DIR = path.resolve('public');
const FRAMES_DIR = path.resolve('public/slides_export');

if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
}

async function generateExports() {
  console.log('🚀 Iniciando geração do PDF e PPTX do pitch Trampakí...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // CSS para modo limpo de exportação de slides 16:9 widescreen
  await page.addStyleTag({
    content: `
      .topbar, .bottombar, .presenter-panel, .final-brand-replay-btn { display: none !important; }
      .workspace { padding: 0 !important; margin: 0 !important; width: 1920px !important; height: 1080px !important; display: flex !important; }
      .slide-viewport { padding: 40px 60px !important; width: 1920px !important; height: 1080px !important; overflow: hidden !important; }
      body { overflow: hidden !important; background: #07090e !important; }
      .scene { animation: none !important; transition: none !important; }
      /* Slide 12 estático */
      .final-anim-pin, .final-tagline { animation: none !important; opacity: 1 !important; transform: none !important; }
    `
  });

  const slideCaptures = [];

  // Capturar slides 1 a 4
  for (let i = 0; i < 4; i++) {
    await page.evaluate((idx) => {
      window.goToScene(idx);
    }, i);
    await new Promise((r) => setTimeout(r, 450));
    const filename = `slide_${String(i + 1).padStart(2, '0')}.png`;
    const filepath = path.join(FRAMES_DIR, filename);
    await page.screenshot({ path: filepath });
    console.log(`✓ Slide ${i + 1} capturado: ${filename}`);
    slideCaptures.push({ slideNum: i + 1, path: filepath, name: `Slide ${i + 1}` });
  }

  // Slide 5: capturar os passos de tela 01 a 06
  await page.evaluate(() => {
    window.goToScene(4); // index 4 = Slide 5
  });
  await new Promise((r) => setTimeout(r, 350));

  const slide5Steps = [];
  for (let step = 0; step < 6; step++) {
    await page.evaluate((s) => {
      window.setAppStep(s, false);
      const img = document.getElementById('realScreenImage');
      if (img) {
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
      }
      const live = document.getElementById('livePrototypeContainer');
      if (live) live.style.display = 'none';
    }, step);
    await new Promise((r) => setTimeout(r, 400));
    const filename = `slide_05_tela_${String(step + 1).padStart(2, '0')}.png`;
    const filepath = path.join(FRAMES_DIR, filename);
    await page.screenshot({ path: filepath });
    console.log(`✓ Slide 5 (Tela ${step + 1}/06) capturado: ${filename}`);
    slide5Steps.push({ stepNum: step + 1, path: filepath });
  }

  // Capturar slides 6 a 12
  for (let i = 5; i < 12; i++) {
    await page.evaluate((idx) => {
      window.goToScene(idx);
    }, i);
    await new Promise((r) => setTimeout(r, 450));
    const filename = `slide_${String(i + 1).padStart(2, '0')}.png`;
    const filepath = path.join(FRAMES_DIR, filename);
    await page.screenshot({ path: filepath });
    console.log(`✓ Slide ${i + 1} capturado: ${filename}`);
    slideCaptures.push({ slideNum: i + 1, path: filepath, name: `Slide ${i + 1}` });
  }

  await browser.close();
  console.log('🎉 Todas as capturas em alta resolução (1920x1080) concluídas!');

  // ==========================================
  // 1. GERAR PDF (12 SLIDES COM TELA 01 NO SLIDE 5)
  // ==========================================
  console.log('📄 Gerando PDF de 12 slides...');
  const pdfDoc = await PDFDocument.create();

  // Ordem dos 12 slides para o PDF
  const pdfSlideList = [
    slideCaptures.find((s) => s.slideNum === 1).path,
    slideCaptures.find((s) => s.slideNum === 2).path,
    slideCaptures.find((s) => s.slideNum === 3).path,
    slideCaptures.find((s) => s.slideNum === 4).path,
    slide5Steps[0].path, // Slide 5 com Tela 01 (conforme solicitado pelo usuário!)
    slideCaptures.find((s) => s.slideNum === 6).path,
    slideCaptures.find((s) => s.slideNum === 7).path,
    slideCaptures.find((s) => s.slideNum === 8).path,
    slideCaptures.find((s) => s.slideNum === 9).path,
    slideCaptures.find((s) => s.slideNum === 10).path,
    slideCaptures.find((s) => s.slideNum === 11).path,
    slideCaptures.find((s) => s.slideNum === 12).path
  ];

  for (let i = 0; i < pdfSlideList.length; i++) {
    const imgBytes = fs.readFileSync(pdfSlideList[i]);
    const embeddedImg = await pdfDoc.embedPng(imgBytes);
    // Dimensões 16:9 padrão HD (1920x1080 pontos)
    const page = pdfDoc.addPage([1920, 1080]);
    page.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: 1920,
      height: 1080
    });
  }

  const pdfBytes = await pdfDoc.save();
  const pdfOutputPath = path.join(OUTPUT_DIR, 'trampaki-pitch.pdf');
  fs.writeFileSync(pdfOutputPath, pdfBytes);
  console.log(`✅ PDF salvo com sucesso em: ${pdfOutputPath} (${(pdfBytes.length / 1024 / 1024).toFixed(2)} MB)`);

  // ==========================================
  // 2. GERAR PPTX COM ANIMAÇÃO/STEPS NO SLIDE 5
  // ==========================================
  console.log('📊 Gerando PPTX widescreen 16:9...');
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.title = 'Trampakí — Apresentação Executiva';
  pres.author = 'Trampakí';
  pres.company = 'Trampakí';

  // Helper para adicionar slide de imagem completa 16:9
  const addImageSlide = (imagePath, notes = '') => {
    const slide = pres.addSlide();
    slide.addImage({
      path: imagePath,
      x: 0,
      y: 0,
      w: '100%',
      h: '100%'
    });
    if (notes) slide.addNotes(notes);
    return slide;
  };

  // Slides 1 a 4
  addImageSlide(slideCaptures.find((s) => s.slideNum === 1).path, 'Slide 1: Capa Executiva Trampakí');
  addImageSlide(slideCaptures.find((s) => s.slideNum === 2).path, 'Slide 2: Problema e Oportunidade no Mercado Informal');
  addImageSlide(slideCaptures.find((s) => s.slideNum === 3).path, 'Slide 3: Solução Trampakí');
  addImageSlide(slideCaptures.find((s) => s.slideNum === 4).path, 'Slide 4: Modelo de Negócio');

  // Slide 5: Sequência das telas 1 a 6 para avanço no clique
  slide5Steps.forEach((step, idx) => {
    addImageSlide(
      step.path,
      `Slide 5 — Demonstração do Produto (Tela ${idx + 1}/06): ao clicar ou avançar, passa para a próxima tela do aplicativo mantendo o mesmo slide.`
    );
  });

  // Slides 6 a 12
  addImageSlide(slideCaptures.find((s) => s.slideNum === 6).path, 'Slide 6: Matriz de Avaliação de Valor');
  addImageSlide(slideCaptures.find((s) => s.slideNum === 7).path, 'Slide 7: Mercado Endereçável (TAM, SAM, SOM)');
  addImageSlide(slideCaptures.find((s) => s.slideNum === 8).path, 'Slide 8: Economia Unitária (Unit Economics)');
  addImageSlide(slideCaptures.find((s) => s.slideNum === 9).path, 'Slide 9: Projeção Financeira e Tração');
  addImageSlide(slideCaptures.find((s) => s.slideNum === 10).path, 'Slide 10: Go-to-Market');
  addImageSlide(slideCaptures.find((s) => s.slideNum === 11).path, 'Slide 11: Equipe e Roadmap');
  addImageSlide(slideCaptures.find((s) => s.slideNum === 12).path, 'Slide 12: Encerramento Trampakí');

  const pptxOutputPath = path.join(OUTPUT_DIR, 'trampaki-pitch.pptx');
  await pres.writeFile({ fileName: pptxOutputPath });
  console.log(`✅ PPTX salvo com sucesso em: ${pptxOutputPath}`);
  console.log('🏆 Exportação concluída com sucesso!');
}

generateExports().catch((err) => {
  console.error('❌ Erro durante exportação:', err);
  process.exit(1);
});
