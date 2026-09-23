import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

// API endpoint to parse raw exam text into structured questions (Non-AI rule-based parser)
app.post('/api/parse-exam-text', async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText || typeof rawText !== 'string') {
      return res.status(400).json({ error: 'กรุณากรอกข้อความข้อสอบ' });
    }

    // Split text into question blocks by numbering (e.g., "1.", "2.", "ข้อ 1", etc.)
    const rawQuestions = rawText.split(/(?=(?:ข้อ\s*\d+|\d+\s*[\.\)]))\s*/i).filter(q => q.trim().length > 0);
    const questions: any[] = [];

    for (let i = 0; i < rawQuestions.length; i++) {
      const block = rawQuestions[i].trim();
      const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);

      if (lines.length === 0) continue;

      let questionText = lines[0].replace(/^(ข้อ\s*\d+|\d+[\.\)]\s*)/i, '').trim();
      let choices: string[] = [];
      let correctAnswer = '';
      let explanation = '';
      let type = 'MULTIPLE_CHOICE';

      for (let j = 1; j < lines.length; j++) {
        const line = lines[j];
        // Check for choices (e.g., "ก.", "ข.", "A.", "B.", "1)", etc.)
        if (/^([กขคงคจฉชซฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮa-d][\.\)]|\d+[\.\)])/i.test(line)) {
          const choiceText = line.replace(/^([กขคงคจฉชซฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮa-d][\.\)]|\d+[\.\)])/i, '').trim();
          choices.push(choiceText);
        } else if (/^(เฉลย|คำตอบ|answer)\s*[:：]/i.test(line)) {
          correctAnswer = line.replace(/^(เฉลย|คำตอบ|answer)\s*[:：]/i, '').trim();
        } else if (/^(คำอธิบาย|เหตุผล|explanation)\s*[:：]/i.test(line)) {
          explanation = line.replace(/^(คำอธิบาย|เหตุผล|explanation)\s*[:：]/i, '').trim();
        } else {
          // If it's part of the question or additional text
          if (choices.length === 0 && !correctAnswer) {
            questionText += ' ' + line;
          } else if (!explanation && correctAnswer) {
            explanation = line;
          }
        }
      }

      // Fallback choices if none found
      if (choices.length === 0) {
        choices = ['ตัวเลือก 1', 'ตัวเลือก 2', 'ตัวเลือก 3', 'ตัวเลือก 4'];
      }

      if (!correctAnswer && choices.length > 0) {
        correctAnswer = choices[0];
      }

      if (choices.length === 2 && (choices.includes('จริง') || choices.includes('True'))) {
        type = 'TRUE_FALSE';
      } else if (choices.length === 0) {
        type = 'SHORT_ANSWER';
      }

      questions.push({
        id: 'q-parsed-' + (i + 1) + '-' + Date.now(),
        type,
        question: questionText || `คำถามที่ ${i + 1}`,
        choices: type === 'SHORT_ANSWER' ? [] : choices,
        correctAnswer: correctAnswer || choices[0] || '',
        explanation: explanation || 'เฉลยตามเกณฑ์ที่กำหนด',
        points: 1
      });
    }

    if (questions.length === 0) {
      return res.status(400).json({ error: 'ไม่พบรูปแบบคำถามในข้อความที่ระบุ กรุณาตรวจสอบรูปแบบ (เช่น 1. โจทย์... ก. ... ข. ...)' });
    }

    res.json({ success: true, questions });
  } catch (error: any) {
    console.error('Error parsing exam text:', error);
    res.status(500).json({ error: error.message || 'ไม่สามารถแปลงข้อความข้อสอบได้' });
  }
});

// API endpoint to generate Google Apps Script code for creating the Google Form
app.post('/api/generate-apps-script', async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'No questions provided.' });
    }

    const scriptCode = `/**
 * Google Apps Script เพื่อสร้าง Google Form สำหรับ: "${title || 'แบบทดสอบ'}"
 * สร้างโดย QuizForm (Non-AI Version)
 * 
 * วิธีใช้งาน:
 * 1. ไปที่ https://script.google.com แล้วสร้าง "โปรเจกต์ใหม่ (New Project)"
 * 2. วางโค้ดนี้ลงใน Code.gs
 * 3. คลิกปุ่ม "เรียกใช้ (Run)" (อนุญาตสิทธิ์ตามขั้นตอน)
 * 4. ตรวจสอบใน Google Drive จะพบ Google Form และ Quiz ที่สร้างเสร็จสมบูรณ์
 */

function createExamGoogleForm() {
  var form = FormApp.create('${title ? title.replace(/'/g, "\\'") : 'แบบทดสอบ'}');
  
  form.setDescription('${description ? description.replace(/'/g, "\\'") : 'สร้างอัตโนมัติโดย QuizForm'}');
  form.setIsQuiz(true);
  form.setCollectEmail(true);
  form.setRequireLogin(true);
  
  var questionsData = ${JSON.stringify(questions, null, 2)};
  
  for (var i = 0; i < questionsData.length; i++) {
    var q = questionsData[i];
    var titleText = (i + 1) + ". " + q.question;
    var points = q.points || 1;
    
    if (q.type === 'MULTIPLE_CHOICE' || q.type === 'TRUE_FALSE') {
      var item = form.addMultipleChoiceItem();
      item.setTitle(titleText);
      item.setPoints(points);
      item.setHelpText(q.explanation || '');
      
      var choices = [];
      for (var j = 0; j < q.choices.length; j++) {
        var choiceText = q.choices[j];
        var isCorrect = (choiceText === q.correctAnswer);
        choices.push(item.createChoice(choiceText, isCorrect));
      }
      item.setChoices(choices);
      
    } else if (q.type === 'SHORT_ANSWER') {
      var item = form.addTextItem();
      item.setTitle(titleText);
      item.setPoints(points);
      item.setHelpText((q.explanation ? q.explanation + ' ' : '') + '[เฉลย: ' + q.correctAnswer + ']');
      
    } else if (q.type === 'MULTIPLE_SELECT') {
      var item = form.addCheckboxItem();
      item.setTitle(titleText);
      item.setPoints(points);
      item.setHelpText(q.explanation || '');
      
      var correctAnswers = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
      var choices = [];
      for (var j = 0; j < q.choices.length; j++) {
        var choiceText = q.choices[j];
        var isCorrect = correctAnswers.includes(choiceText);
        choices.push(item.createChoice(choiceText, isCorrect));
      }
      item.setChoices(choices);
    }
  }
  
  Logger.log('สร้าง Google Form สำเร็จ! ลิงก์แก้ไข: ' + form.getEditUrl());
}
`;

    res.json({ success: true, scriptCode });
  } catch (error: any) {
    console.error('Error generating Apps Script:', error);
    res.status(500).json({ error: error.message || 'ไม่สามารถสร้าง Apps Script ได้' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
