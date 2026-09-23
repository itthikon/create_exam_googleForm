import React, { useState, useEffect } from 'react';
import { 
  FileText, Code2, PlayCircle, BookOpen, Download, Copy, Check, 
  Trash2, Plus, Edit3, Award, Clock, ArrowRight, RefreshCw, 
  HelpCircle, CheckCircle2, AlertCircle, Printer, FolderOpen, Save,
  Upload, FileUp, FileCheck
} from 'lucide-react';
import mammoth from 'mammoth';

interface Question {
  id: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'MULTIPLE_SELECT' | 'SHORT_ANSWER';
  question: string;
  choices: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  questions: Question[];
  createdAt: string;
}

const PRELOADED_EXAMS: Exam[] = [
  {
    id: 'exam-buddhist-40',
    title: 'แบบทดสอบพระพุทธศาสนาและเศรษฐกิจพอเพียง (40 ข้อ)',
    description: 'แบบทดสอบวัดผลสัมฤทธิ์ทางการเรียน วิชาพระพุทธศาสนาและเศรษฐกิจพอเพียง จำนวน 40 ข้อ',
    subject: 'สังคมศึกษา / พระพุทธศาสนา',
    gradeLevel: 'มัธยมศึกษา',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1',
        type: 'MULTIPLE_CHOICE',
        question: 'คุณธรรมในข้อใดไม่สัมพันธ์กับเศรษฐกิจพอเพียง',
        choices: [
          'สติ : ระลึก ตระหนักในการกระทำของตนตามหลักเหตุและผล',
          'ปัญญา : เพียงพอบนความรอบรู้และเหตุผล ฉลาดคิด ใช้และทำ',
          'คุณธรรม : ไม่เบียดเบียนตนเอง ผู้อื่น และทรัพยากรธรรมชาติ',
          'วัฒนธรรม : ปรับวัฒนธรรมให้ทันสมัยกับการเปลี่ยนแปลงของโลก'
        ],
        correctAnswer: 'วัฒนธรรม : ปรับวัฒนธรรมให้ทันสมัยกับการเปลี่ยนแปลงของโลก',
        explanation: 'วัฒนธรรมไม่ใช่เงื่อนไขคุณธรรมตามหลักเศรษฐกิจพอเพียง',
        points: 1
      },
      {
        id: 'q2',
        type: 'MULTIPLE_CHOICE',
        question: 'ศัพท์ในความหมายใดที่เกี่ยวกับระบบเศรษฐกิจพอเพียง',
        choices: ['Price Mechanism', 'e-commerce', 'Mass Production', 'Self Sufficiency Economic'],
        correctAnswer: 'Self Sufficiency Economic',
        explanation: 'เศรษฐกิจพอเพียงแปลว่า Self Sufficiency Economy',
        points: 1
      },
      {
        id: 'q3',
        type: 'MULTIPLE_CHOICE',
        question: 'ปรัชญาเศรษฐกิจพอเพียงตรงกับความหมายของการปฏิบัติตนตามหลักธรรมใดในทางพระพุทธศาสนา',
        choices: ['มัชฌิมาปฏิปทา', 'บุญกิริยาวัตถุ 3', 'พุทธโอวาท 3', 'อริยบุคคล 4'],
        correctAnswer: 'มัชฌิมาปฏิปทา',
        explanation: 'มัชฌิมาปฏิปทา คือ ทางสายกลาง ความพอดี',
        points: 1
      },
      {
        id: 'q4',
        type: 'MULTIPLE_CHOICE',
        question: 'พระราชดำรัสว่า “ความเจริญของคนทั้งหลายย่อมเกิดจากการประพฤติดีประพฤติชอบ หาเลี้ยงชีพในทางที่ชอบเป็นสำคัญ” ตรงกับความหมายของหลักธรรมใด',
        choices: ['สัมมาทิฏฐิ', 'สัมมาวายามะ', 'สัมมาอาชีวะ', 'สัมมาสมาธิ'],
        correctAnswer: 'สัมมาอาชีวะ',
        explanation: 'การหาเลี้ยงชีพในทางที่ชอบ คือ สัมมาอาชีวะ',
        points: 1
      },
      {
        id: 'q5',
        type: 'MULTIPLE_CHOICE',
        question: 'เศรษฐกิจพอเพียงสอนให้ลดการพึ่งพาปัจจัยภายนอก ให้พึ่งตนเอง โดยบูรณาการทรัพยากรที่มีอยู่มาใช้ให้เกิดประโยชน์สูงสุด ตรงกับหลักธรรมใดในทางพระพุทธศาสนา',
        choices: ['ธัมมัญญุตา อัตถัญญุตา', 'สันตุฏฐี ปะระมัง ธะนัง', 'อัตตาหิ อัตตะโน นาโถ', 'มัตตัญญุตา'],
        correctAnswer: 'อัตตาหิ อัตตะโน นาโถ',
        explanation: 'อัตตาหิ อัตตะโน นาโถ หมายถึง ตนแลเป็นที่พึ่งแห่งตน',
        points: 1
      },
      {
        id: 'q6',
        type: 'MULTIPLE_CHOICE',
        question: 'พอประมาณ มีเหตุผล มีภูมิคุ้มกัน ทุกการกระทำในการดำเนินชีวิต มีความสัมพันธ์กับหลักธรรมใดในพระพุทธศาสนา',
        choices: ['มัชฌิมาปฏิปทา', 'ธัมมัญญุตา', 'อัตถัญญุตา', 'สันตุฏฐี ปะระมัง ธะนัง'],
        correctAnswer: 'มัชฌิมาปฏิปทา',
        explanation: 'ความพอประมาณและทางสายกลางตรงกับ มัชฌิมาปฏิปทา',
        points: 1
      },
      {
        id: 'q7',
        type: 'MULTIPLE_CHOICE',
        question: 'การพัฒนาในลักษณะใดที่เป็นการพัฒนาแบบไม่ยั่งยืน',
        choices: [
          'คนสัมพันธ์กับสิ่งแวดล้อมอย่างเอื้อเฟื้อเกื้อกูลกัน',
          'ใช้วิทยาศาสตร์และเทคโนโลยีเพื่อสร้างสรรค์ประโยชน์',
          'การพัฒนาที่มุ่งให้เกิดความสมดุลในด้านเศรษฐกิจ สังคม และสิ่งแวดล้อม',
          'การใช้ทรัพยากรที่มีอยู่มาพัฒนาความเจริญทางเศรษฐกิจให้มากที่สุด'
        ],
        correctAnswer: 'การใช้ทรัพยากรที่มีอยู่มาพัฒนาความเจริญทางเศรษฐกิจให้มากที่สุด',
        explanation: 'การมุ่งเน้นเศรษฐกิจอย่างเดียวโดยไม่คำนึงถึงสิ่งแวดล้อมคือการพัฒนาที่ไม่ยั่งยืน',
        points: 1
      },
      {
        id: 'q8',
        type: 'MULTIPLE_CHOICE',
        question: 'ข้อใดเป็นความหมายของหลักธรรม “สันตุฏฐี ปะระมัง ธะนัง” ตามหลักเศรษฐกิจพอเพียง',
        choices: [
          'พยายามไม่ก่อความชั่วให้เป็นเครื่องทำลายตัว ทำลายผู้อื่น',
          'ความสุขความเจริญอันแท้จริงนั้นต้องเกิดจากการแสวงหามาได้ด้วยความเป็นธรรม',
          'ความเป็นอยู่ที่ไม่ต้องฟุ่มเฟือย ต้องประหยัดในทางที่ถูกต้อง',
          'ความเจริญที่แท้จริงย่อมเกิดจากการประพฤติชอบ เลี้ยงชีพในทางที่ชอบเป็นสำคัญ'
        ],
        correctAnswer: 'ความเป็นอยู่ที่ไม่ต้องฟุ่มเฟือย ต้องประหยัดในทางที่ถูกต้อง',
        explanation: 'สันตุฏฐี ปะระมัง ธะนัง คือ ความสันโดษ ความพอใจในสิ่งที่มี',
        points: 1
      },
      {
        id: 'q9',
        type: 'MULTIPLE_CHOICE',
        question: 'การพัฒนาประเทศแบบยั่งยืน เหมาะกับการนำระบบเศรษฐกิจใดมาใช้',
        choices: ['ระบบทุนนิยม', 'ระบบสังคมนิยม', 'ระบบเศรษฐกิจแบบผสม', 'ระบบเศรษฐกิจพอเพียง'],
        correctAnswer: 'ระบบเศรษฐกิจพอเพียง',
        explanation: 'เศรษฐกิจพอเพียงเน้นความสมดุล มั่นคง และยั่งยืน',
        points: 1
      },
      {
        id: 'q10',
        type: 'MULTIPLE_CHOICE',
        question: 'การพัฒนาแบบยั่งยืน มีความหมายตามข้อใด',
        choices: ['การเจริญเติบโตทางเศรษฐกิจ', 'การเจริญทางเทคโนโลยี', 'การพัฒนาความเจริญทางด้านอุตสาหกรรม', 'การพัฒนาที่ไม่ก่อให้เกิดปัญหาตามมาอีกในอนาคต'],
        correctAnswer: 'การพัฒนาที่ไม่ก่อให้เกิดปัญหาตามมาอีกในอนาคต',
        explanation: 'ความยั่งยืนหมายถึงการพัฒนาที่ตอบสนองความต้องการปัจจุบันโดยไม่กระทบอนาคต',
        points: 1
      },
      {
        id: 'q11',
        type: 'MULTIPLE_CHOICE',
        question: 'ปัญญาระดับใดเป็นปัญญาที่เกิดขึ้นเบื้องต้นของกระบวนการศึกษา',
        choices: ['สุตมยปัญญา', 'จินตมยปัญญา', 'ภาวนามยปัญญา', 'วิปัสนาปัญญา'],
        correctAnswer: 'สุตมยปัญญา',
        explanation: 'สุตมยปัญญา คือ ปัญญาที่เกิดจากการฟังและการศึกษาเล่าเรียน',
        points: 1
      },
      {
        id: 'q12',
        type: 'MULTIPLE_CHOICE',
        question: 'มนุษย์เป็นสัตว์ประเสริฐด้วยการศึกษาเพราะเหตุผลตามข้อใด',
        choices: ['มีสัญชาตญาณในการดำเนินชีวิต', 'จดจำคำสั่งได้ดี', 'มีศักยภาพที่พัฒนาได้สูงสุด', 'มีสัญชาตญาณในการฝึกหัด'],
        correctAnswer: 'มีศักยภาพที่พัฒนาได้สูงสุด',
        explanation: 'มนุษย์ฝึกฝนและพัฒนาตนเองได้สูงสุดด้วยการศึกษา',
        points: 1
      },
      {
        id: 'q13',
        type: 'MULTIPLE_CHOICE',
        question: 'หลักพุทธธรรมที่เป็นเกณฑ์ในการพิจารณาปัญหาครอบคลุมทั้งระบบอย่างเป็นกระบวนการในการศึกษาคือหลักธรรมตามข้อใด',
        choices: ['อริยสัจ 4-ปฏิจจสมุปบาท', 'มรรคมีองค์ 8', 'สาราณียธรรม 6', 'อปริหานิยธรรม 7'],
        correctAnswer: 'อริยสัจ 4-ปฏิจจสมุปบาท',
        explanation: 'อริยสัจ 4 และปฏิจจสมุปบาทเป็นกรอบคิดและกระบวนการแก้ปัญหาอย่างเป็นระบบ',
        points: 1
      },
      {
        id: 'q14',
        type: 'MULTIPLE_CHOICE',
        question: 'ธรรมเป็นที่ตั้งแห่งการระลึกถึง มีความปรารถนาดีต่อกัน และเอื้อเฟื้อเกื้อกูลกัน เป็นความหมายของหลักธรรมในข้อใด',
        choices: ['สาราณียธรรม 6', 'อริยสัจ 4', 'พรหมวิหาร 4', 'ทศพิธราชธรรม'],
        correctAnswer: 'สาราณียธรรม 6',
        explanation: 'สาราณียธรรม 6 คือ ธรรมเป็นเครื่องทำให้อยู่ร่วมกันด้วยความรักและความสามัคคี',
        points: 1
      },
      {
        id: 'q15',
        type: 'MULTIPLE_CHOICE',
        question: 'หลักธรรมใดเป็นปัจจัยกระตุ้นการเรียนรู้จากภายในตามแนวทางการจัดกระบวนการศึกษาแบบสัมมาทิฏฐิ',
        choices: ['ปรโตโฆสะ', 'โยนิโสมนสิการ', 'อัปปมาทธรรม', 'กัลยาณมิตตตา'],
        correctAnswer: 'โยนิโสมนสิการ',
        explanation: 'โยนิโสมนสิการ คือ การคิดอย่างแยบคาย เป็นปัจจัยภายใน',
        points: 1
      },
      {
        id: 'q16',
        type: 'MULTIPLE_CHOICE',
        question: 'ข้อใดเป็นความหมายของอปริหานิยธรรม ซึ่งเป็นหลักธรรมที่ใช้ในการปกครอง',
        choices: [
          'หลักเพื่อป้องกันมิให้การบริหารหมู่คณะเสื่อมถอย',
          'หลักธรรมที่เป็นที่ตั้งแห่งการระลึกถึงปรารถนาดีต่อกัน',
          'หลักธรรมเพื่อให้ยึดเหนี่ยวจิตใจของผู้อื่น',
          'หลักความประพฤติที่ประเสริฐบริสุทธิ์'
        ],
        correctAnswer: 'หลักเพื่อป้องกันมิให้การบริหารหมู่คณะเสื่อมถอย',
        explanation: 'อปริหานิยธรรม 7 เป็นธรรมอันไม่เป็นที่ตั้งแห่งความเสื่อม',
        points: 1
      },
      {
        id: 'q17',
        type: 'MULTIPLE_CHOICE',
        question: 'ข้อใดกล่าวถึงหลักธรรมพรหมวิหาร 4 ได้ถูกต้องมากที่สุด เกี่ยวกับการสร้างสังคมให้เกิดสันติภาพ',
        choices: ['เมตตาธรรมค้ำจุนโลก', 'เมตตาธรรมนำสุข', 'เมตตาธรรมปราบอธรรม', 'เมตตาธรรมนำสังคมเจริญ'],
        correctAnswer: 'เมตตาธรรมค้ำจุนโลก',
        explanation: 'เมตตาและกรุณาค้ำจุนโลกให้สงบสุข',
        points: 1
      },
      {
        id: 'q18',
        type: 'MULTIPLE_CHOICE',
        question: 'ข้อใดเป็นความหมายของหลักจักรวรรดิวัตร',
        choices: [
          'พระราชกรณียกิจของพระราชา',
          'ธรรมเนียมการบำเพ็ญธรรมของนักปกครอง',
          'ธรรมเนียมการบำเพ็ญพระราชกรณียกิจของพระเจ้าจักรพรรดิ',
          'พระราชกรณียกิจของสมเด็จพระธรรมราชา'
        ],
        correctAnswer: 'ธรรมเนียมการบำเพ็ญพระราชกรณียกิจของพระเจ้าจักรพรรดิ',
        explanation: 'จักรวรรดิวัตร คือ ธรรมเนียมปฏิบัติของนักปกครอง',
        points: 1
      },
      {
        id: 'q19',
        type: 'MULTIPLE_CHOICE',
        question: 'การปกครองสังคมประเทศชาติให้เกิดสันติภาพ ผู้ปกครองจะต้องมีหลักธรรมตามข้อใด',
        choices: ['พรหมวิหารธรรม', 'สาราณียธรรม', 'อปริหานิยธรรม', 'ทศพิธราชธรรม'],
        correctAnswer: 'สาราณียธรรม',
        explanation: 'สาราณียธรรมสร้างความสามัคคีในหมู่คณะ',
        points: 1
      },
      {
        id: 'q20',
        type: 'MULTIPLE_CHOICE',
        question: 'ข้อใดให้ความหมายราชสังคหวัตถุ 4 หลักการสังเคราะห์ประชาชนของพระราชาได้ไม่สัมพันธ์กับหัวข้อหลักธรรม',
        choices: [
          'สัสสเมธะ : ส่งเสริมการเกษตร',
          'ปุริสะเมธะ : ส่งเสริมคนดีมีความสามารถ',
          'สัมมาปาสะ : ผูกประสานรวมใจประชาชนด้วยการส่งเสริมอาชีพ',
          'วาชเปยะ : วาจามีอำนาจเป็นที่ยำเกรงของประชาชน'
        ],
        correctAnswer: 'วาชเปยะ : วาจามีอำนาจเป็นที่ยำเกรงของประชาชน',
        explanation: 'วาชเปยะ คือ การพูดจาด้วยถ้อยคำอันไพเราะเป็นประโยชน์',
        points: 1
      },
      {
        id: 'q21',
        type: 'MULTIPLE_CHOICE',
        question: 'หลักธรรมนิยามในข้อใดผิดจากความเป็นจริง',
        choices: [
          'อุตุนิยาม : กฎธรรมชาติเกี่ยวกับสภาพภูมิอากาศ',
          'พีชนิยาม : กฎธรรมชาติเกี่ยวกับการสืบพันธุ์',
          'จิตนิยาม : กฎธรรมชาติเกี่ยวกับด้านจิตวิทยา',
          'กรรมนิยาม : กฎธรรมชาติที่เกี่ยวกับพฤติกรรมของมนุษย์หรือกฎแห่งกรรม'
        ],
        correctAnswer: 'จิตนิยาม : กฎธรรมชาติเกี่ยวกับด้านจิตวิทยา',
        explanation: 'จิตนิยามเป็นกฎธรรมชาติเกี่ยวกับการทำงานของจิตใจ',
        points: 1
      },
      {
        id: 'q22',
        type: 'MULTIPLE_CHOICE',
        question: 'พระภิกษุรูปหนึ่งท่านมีนิสัยเอื้อเฟื้อเผื่อแผ่แก่ภิกษุรูปอื่นเสมอ ทำให้ท่านได้รับอานิสงส์คือ กลายเป็นผู้โชคดีในลาภสักการะโดยตลอด เป็นเพราะท่านปฏิบัติตามหลักธรรมใด',
        choices: ['โภคอาทิยะ 5', 'อริยวัฑฒิ 5', 'วุฒิธรรม 4', 'สาราณียธรรม 6'],
        correctAnswer: 'สาราณียธรรม 6',
        explanation: 'การเอื้อเฟื้อเผื่อแผ่เป็นหนึ่งในสาราณียธรรม',
        points: 1
      },
      {
        id: 'q23',
        type: 'MULTIPLE_CHOICE',
        question: 'ผู้ที่ประกอบอาชีพค้าขายควรเน้นหลักธรรมใดไปปฏิบัติ',
        choices: ['วุฒิธรรม 4', 'มิจฉาวณิชชา 5', 'ปาปณิกธรรม 3', 'พระสัทธรรม 3'],
        correctAnswer: 'ปาปณิกธรรม 3',
        explanation: 'ปาปณิกธรรม 3 เป็นธรรมสำหรับผู้ประกอบอาชีพค้าขาย',
        points: 1
      },
      {
        id: 'q24',
        type: 'MULTIPLE_CHOICE',
        question: 'ธรรมในข้อใดที่ไม่ควรให้เกิดขึ้นซึ่งเป็นสิ่งที่ขวางกั้นความเจริญของจิตในการฝึกสติ',
        choices: ['นิวรณ์ 5', 'มิจฉาวณิชชา 5', 'วิตก 3', 'โลกธรรม 8'],
        correctAnswer: 'นิวรณ์ 5',
        explanation: 'นิวรณ์ 5 เป็นเครื่องกั้นความดี เครื่องขัดขวางสมาธิ',
        points: 1
      },
      {
        id: 'q25',
        type: 'MULTIPLE_CHOICE',
        question: 'การประพฤติตนให้เป็นผู้มีระเบียบวินัยไม่ก่อความเดือดร้อน หรือเบียดเบียนผู้อื่น เป็นความหมายในข้อใด ของหมวดธรรมภาวนา 4',
        choices: ['กายภาวนา', 'สีลภาวนา', 'จิตตภาวนา', 'ปัญญาภาวนา'],
        correctAnswer: 'สีลภาวนา',
        explanation: 'ศีลภาวนาคือการพัฒนาความประพฤติทางกายวาจาให้เรียบร้อย',
        points: 1
      },
      {
        id: 'q26',
        type: 'MULTIPLE_CHOICE',
        question: 'หลักธรรมใดเป็นการดำเนินไปสู่การดับทุกข์ได้ตามความหมายของอริยสัจ 4',
        choices: ['มรรคมีองค์ 8', 'โลกธรรม 8', 'ขันธ์ 5', 'นิวรณ์ 5'],
        correctAnswer: 'มรรคมีองค์ 8',
        explanation: 'มรรคมีองค์ 8 คือ ข้อปฏิบัติให้ถึงความดับทุกข์',
        points: 1
      },
      {
        id: 'q27',
        type: 'MULTIPLE_CHOICE',
        question: 'ข้อใดให้ความหมายพุทธศาสนสุภาษิตได้ถูกต้อง',
        choices: ['คำสุภาษิตของพระสงฆ์', 'คำสุภาษิตของพระเถระผู้ใหญ่', 'คำสุภาษิตของนักปราชญ์ทางพระพุทธศาสนา', 'คำสุภาษิตทางพระพุทธศาสนา'],
        correctAnswer: 'คำสุภาษิตทางพระพุทธศาสนา',
        explanation: 'พุทธศาสนสุภาษิตคือคำสอนในพระพุทธศาสนา',
        points: 1
      },
      {
        id: 'q28',
        type: 'MULTIPLE_CHOICE',
        question: 'ธรรมในข้อใดที่เป็นธรรมหัวใจเศรษฐี คือ ทำให้บุคคลสามารถสร้างทรัพย์และรักษาทรัพย์ของตนเองให้ดำรงอยู่ได้',
        choices: ['อุบาสกธรรม 5', 'โภคอาทิยะ 5', 'อริยวัฑฒิ 5', 'ทิฏฐธัมมิกัตถสังวัตตนิกธรรม 4'],
        correctAnswer: 'ทิฏฐธัมมิกัตถสังวัตตนิกธรรม 4',
        explanation: 'อุฏฐานสัมปทา อารักขสัมปทา กัลยาณมิตตตา สามีวิภัตติ คือ หัวใจเศรษฐี',
        points: 1
      },
      {
        id: 'q29',
        type: 'MULTIPLE_CHOICE',
        question: 'การรู้จักความพอประมาณในปัจจัย 4 เป็นความหมายมงคล 38 ในข้อใด',
        choices: ['เขมํ', 'ตโป', 'สนฺตุฏฺฐี', 'วิรชํ'],
        correctAnswer: 'สนฺตุฏฺฐี',
        explanation: 'สันตุฏฐี คือ ความสันโดษ พอใจในปัจจัย 4',
        points: 1
      },
      {
        id: 'q30',
        type: 'MULTIPLE_CHOICE',
        question: 'ในการศึกษาเล่าเรียน นักเรียนควรยึดพุทธศาสนสุภาษิตใดมาปฏิบัติ',
        choices: ['โกธํ ฆตฺวา สุขํ เสติ', 'วายเมเถว ปุริโส ยาว อตฺถสฺส นิปฺปทา', 'อิณาทานํ ทุกฺขํ โลเก', 'จิตฺตํ ทนฺตํ สุขาวหํ'],
        correctAnswer: 'วายเมเถว ปุริโส ยาว อตฺถสฺส นิปฺปทา',
        explanation: 'บุคคลควรพยายามร่ำไปจนกว่าจะประสบความสำเร็จ',
        points: 1
      },
      {
        id: 'q31',
        type: 'MULTIPLE_CHOICE',
        question: 'ต้นคดปลายตรงเป็นลักษณะของพระสาวกรูปใด',
        choices: ['พระอานนท์', 'พระอัสสชิ', 'พระองคุลิมาล', 'พระนาคเสน'],
        correctAnswer: 'พระองคุลิมาล',
        explanation: 'พระองคุลิมาลมีประวัติเริ่มต้นทำบาปแต่ตอนปลายชีวิตบรรลุอรหันต์',
        points: 1
      },
      {
        id: 'q32',
        type: 'MULTIPLE_CHOICE',
        question: 'พระสาวกรูปใดที่มีความสัมพันธ์ในฐานะอาจารย์กับศิษย์',
        choices: ['พระอัสสชิ พระสารีบุตร', 'พระสารีบุตร พระโมคคัลลานะ', 'พระอานนท์ พระอนุรุทธะ', 'พระนาคเสน พระยามิลินท์'],
        correctAnswer: 'พระอัสสชิ พระสารีบุตร',
        explanation: 'พระอัสสชิแสดงธรรมจนพระสารีบุตรได้ดวงตาเห็นธรรม',
        points: 1
      },
      {
        id: 'q33',
        type: 'MULTIPLE_CHOICE',
        question: 'พระอานนท์ท่านเป็นผู้มีปฏิปทาแบบอย่างที่ดีทางด้านการศึกษาอย่างไร',
        choices: ['เป็นผู้มีความเพียรเป็นเลิศ', 'เป็นผู้เลิศทางพหูสูต', 'เป็นผู้เลิศทางด้านปัญญา', 'เป็นผู้เลิศทางด้านอิทธิปาฏิหาริย์'],
        correctAnswer: 'เป็นผู้เลิศทางพหูสูต',
        explanation: 'พระอานนท์ทรงจำพุทธพจน์ได้มากที่สุด',
        points: 1
      },
      {
        id: 'q34',
        type: 'MULTIPLE_CHOICE',
        question: 'พระธรรมโกศาจารย์ (พุทธทาสภิกขุ) มีความสัมพันธ์กับข้อใด',
        choices: ['หนังสือพจนานุกรมพุทธศาสนา', 'สวนโมกขพลาราม', 'วัดหนองป่าพง', 'หนังสือพุทธธรรม'],
        correctAnswer: 'สวนโมกขพลาราม',
        explanation: 'ท่านพุทธทาสภิกขุเป็นผู้ก่อตั้งสวนโมกขพลาราม',
        points: 1
      },
      {
        id: 'q35',
        type: 'MULTIPLE_CHOICE',
        question: '“ก่อนหน้านี้เธอเข้าใจว่าลูกของเธอเท่านั้นที่ตาย อันความตายนั้นเป็นของธรรมดาที่มีคู่กับสัตว์ทั้งหลายที่เกิดมาในโลก...” เป็นพระธรรมเทศนาที่พระพุทธเจ้าแสดงประทานแก่ใคร',
        choices: ['พระธัมมทินนาเถรี', 'พระปฏาจาราเถรี', 'พระอุบลวัณณาเถรี', 'พระกีสาโคตมีเถรี'],
        correctAnswer: 'พระกีสาโคตมีเถรี',
        explanation: 'เหตุการณ์เมล็ดพันธุ์ผักกาดขาว เกิดขึ้นกับนางกีสาโคตมี',
        points: 1
      },
      {
        id: 'q36',
        type: 'MULTIPLE_CHOICE',
        question: 'พระอาจารย์มั่น ภูริทตฺโต เป็นแบบอย่างที่ดีของพระสงฆ์ทางด้านใด',
        choices: ['ผู้มุ่งมั่นปฏิบัติธรรมเจริญกรรมฐาน', 'ผู้มุ่งมั่นศึกษาหาความรู้ทางด้านปริยัติจนแตกฉาน', 'ผู้ฉลาดในการแต่งตำราทางพระพุทธศาสนา', 'ผู้ที่เป็นแบบอย่างในการแสวงหาความเจริญทางการศึกษา'],
        correctAnswer: 'ผู้มุ่งมั่นปฏิบัติธรรมเจริญกรรมฐาน',
        explanation: 'หลวงปู่มั่นเป็นพระเถระปฏิบัติฝ่ายวิปัสสนากรรมฐาน',
        points: 1
      },
      {
        id: 'q37',
        type: 'MULTIPLE_CHOICE',
        question: 'พุทธศาสนิกชนตัวอย่างท่านใดเป็นบุคคลแรกที่นำเอาพระพุทธศาสนากลับมาสู่มาตุภูมิ ทำให้ชาวอินเดียจำนวนหลายล้านคนหันมานับถือพระพุทธศาสนา',
        choices: ['อนาคาริก ธรรมปาละ', 'Dr. Ambedkar', 'สุชีพ ปุญญานุภาพ', 'มหาตมะคานธี'],
        correctAnswer: 'อนาคาริก ธรรมปาละ',
        explanation: 'อนาคาริก ธรรมปาละ เป็นผู้ริเริ่มฟื้นฟูพระพุทธศาสนาในอินเดีย',
        points: 1
      },
      {
        id: 'q38',
        type: 'MULTIPLE_CHOICE',
        question: 'ข้อคิดที่ได้จากการศึกษาประวัติของจูฬสุภัททาข้อใด ที่นักเรียนควรนำมาเป็นแบบอย่าง',
        choices: ['มีเมตตากรุณาต่อผู้อื่น', 'มีความอดทนอดกลั้น', 'มีความศรัทธา เลื่อมใสในพระพุทธศาสนา', 'มีความใฝ่ใจในการศึกษาธรรม'],
        correctAnswer: 'มีความศรัทธา เลื่อมใสในพระพุทธศาสนา',
        explanation: 'นางจูฬสุภัททาเป็นแบบอย่างในการรักษาศรัทธา',
        points: 1
      },
      {
        id: 'q39',
        type: 'MULTIPLE_CHOICE',
        question: 'เหตุการณ์ในชาดกเรื่องใด ไม่สัมพันธ์กัน',
        choices: [
          'เวสสันดรชาดก : เป็นชาติที่พระพุทธเจ้าบำเพ็ญบารมีเป็นชาติสุดท้าย',
          'มโหสถชาดก : เป็นอดีตชาติที่พระพุทธเจ้าบำเพ็ญปัญญาบารมี',
          'มหาชนกชาดก : เป็นอดีตชาติที่พระพุทธเจ้าบำเพ็ญวิริยบารมี',
          'ชาดก : เป็นเรื่องราวที่พุทธสาวกนำมาประกอบการแสดงธรรม'
        ],
        correctAnswer: 'ชาดก : เป็นเรื่องราวที่พุทธสาวกนำมาประกอบการแสดงธรรม',
        explanation: 'ชาดกเป็นเรื่องราวอดีตชาติของพระพุทธเจ้า',
        points: 1
      },
      {
        id: 'q40',
        type: 'MULTIPLE_CHOICE',
        question: 'พระมหากษัตริย์พระองค์ใดที่ทรงมีพระทัยหนักแน่นในการนับถือพระพุทธศาสนา เห็นได้จากพระองค์ทรงปฏิเสธการเข้ารีตศาสนาคริสต์',
        choices: [
          'สมเด็จพระนารายณ์มหาราช',
          'พระบาทสมเด็จพระจุลจอมเกล้าเจ้าอยู่หัว',
          'พระบาทสมเด็จพระพุทธยอดฟ้าจุฬาโลกมหาราช',
          'สมเด็จพระเจ้าตากสินมหาราช'
        ],
        correctAnswer: 'สมเด็จพระนารายณ์มหาราช',
        explanation: 'สมเด็จพระนารายณ์มหาราชมั่นคงในพระพุทธศาสนา',
        points: 1
      }
    ]
  }
];

// Helper function to parse raw exam text into structured questions (Non-AI Rule-Based Parser)
function parseExamTextToQuestions(text: string): Question[] {
  // Normalize line endings and split blocks
  const cleanText = text.replace(/\r\n/g, '\n');
  // Split by question indicators like "1.", "2.", "ข้อ 1", "ข้อที่ 1", etc.
  const rawQuestions = cleanText.split(/(?=(?:ข้อ\s*(?:ที่)?\s*\d+|question\s*\d+|\d+\s*[\.\)]))\s*/i).filter(q => q.trim().length > 0);
  const questions: Question[] = [];

  for (let i = 0; i < rawQuestions.length; i++) {
    const block = rawQuestions[i].trim();
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    if (lines.length === 0) continue;

    let questionText = lines[0].replace(/^(ข้อ\s*(?:ที่)?\s*\d+|question\s*\d+|\d+[\.\)]\s*)/i, '').trim();
    let choices: string[] = [];
    let correctAnswer = '';
    let explanation = '';
    let type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'MULTIPLE_SELECT' | 'SHORT_ANSWER' = 'MULTIPLE_CHOICE';

    for (let j = 1; j < lines.length; j++) {
      const line = lines[j];
      
      // Check for answers/explanations first
      if (/^(เฉลย|คำตอบ|answer)\s*[:：]\s*/i.test(line)) {
        correctAnswer = line.replace(/^(เฉลย|คำตอบ|answer)\s*[:：]\s*/i, '').trim();
        continue;
      }
      if (/^(คำอธิบาย|เหตุผล|explanation)\s*[:：]\s*/i.test(line)) {
        explanation = line.replace(/^(คำอธิบาย|เหตุผล|explanation)\s*[:：]\s*/i, '').trim();
        continue;
      }

      // Check for choices: e.g. "ก.", "ข.", "(ก)", "A.", "1)", etc.
      const choiceMatch = line.match(/^[\(\[]?\s*([ก-ฮa-d\d])\s*[\.\)\]]\s*(.+)$/i);
      if (choiceMatch) {
        const choiceText = choiceMatch[2].trim();
        choices.push(choiceText);
      } else {
        // If no choice prefix matched, check if it's a continuation of question or explanation or choice
        if (choices.length === 0 && !correctAnswer) {
          questionText += ' ' + line;
        } else if (choices.length > 0 && !correctAnswer) {
          // Maybe a choice without explicit prefix or multi-line choice
          choices[choices.length - 1] += ' ' + line;
        } else if (correctAnswer && !explanation) {
          explanation = line;
        }
      }
    }

    // Fallback choices if none detected
    if (choices.length === 0) {
      choices = ['ตัวเลือก 1', 'ตัวเลือก 2', 'ตัวเลือก 3', 'ตัวเลือก 4'];
    }

    // Resolve answer mapping
    if (!correctAnswer && choices.length > 0) {
      correctAnswer = choices[0];
    } else {
      const thaiLetters = ['ก', 'ข', 'ค', 'ง', 'จ', 'ฉ', 'ช', 'ซ', 'ฌ', 'ญ'];
      const cleanAns = correctAnswer.replace(/[\.\s:\(\)]/g, '').toLowerCase();
      
      if (thaiLetters.includes(cleanAns)) {
        const idx = thaiLetters.indexOf(cleanAns);
        if (idx >= 0 && idx < choices.length) {
          correctAnswer = choices[idx];
        }
      } else if (['a', 'b', 'c', 'd', 'e'].includes(cleanAns)) {
        const idx = cleanAns.charCodeAt(0) - 97;
        if (idx >= 0 && idx < choices.length) {
          correctAnswer = choices[idx];
        }
      } else if (/^\d+$/.test(cleanAns)) {
        const idx = parseInt(cleanAns, 10) - 1;
        if (idx >= 0 && idx < choices.length) {
          correctAnswer = choices[idx];
        }
      } else {
        // Try matching substring or exact match
        const matchedChoice = choices.find(c => c.toLowerCase().includes(cleanAns) || cleanAns.includes(c.toLowerCase()));
        if (matchedChoice) {
          correctAnswer = matchedChoice;
        } else {
          correctAnswer = choices[0];
        }
      }
    }

    if (choices.length === 2 && (choices.some(c => c.includes('จริง') || c.includes('เท็จ') || c.toLowerCase().includes('true') || c.toLowerCase().includes('false')))) {
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

  return questions;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'importer' | 'editor' | 'export' | 'preview' | 'bank'>('importer');
  
  const [currentExam, setCurrentExam] = useState<Exam>({
    id: 'exam-' + Date.now(),
    title: 'แบบทดสอบใหม่',
    description: 'นำเข้าจากไฟล์ Text, Word, PDF หรือคัดลอกข้อความ',
    subject: 'ทั่วไป',
    gradeLevel: 'มัธยมศึกษา',
    questions: PRELOADED_EXAMS[0].questions,
    createdAt: new Date().toISOString()
  });

  const [savedExams, setSavedExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('quizform_saved_exams_non_ai');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return PRELOADED_EXAMS;
  });

  // Importer state
  const [rawText, setRawText] = useState(`1. คุณธรรมในข้อใดไม่สัมพันธ์กับเศรษฐกิจพอเพียง
ก.สติ : ระลึก ตระหนักในการกระทำของตนตามหลักเหตุและผล
ข.ปัญญา : เพียงพอบนความรอบรู้และเหตุผล ฉลาดคิด ใช้และทำ
ค.คุณธรรม : ไม่เบียดเบียนตนเอง ผู้อื่น และทรัพยากรธรรมชาติ
ง.วัฒนธรรม : ปรับวัฒนธรรมให้ทันสมัยกับการเปลี่ยนแปลงของโลก
เฉลย : ง

2. ศัพท์ในความหมายใดที่เกี่ยวกับระบบเศรษฐกิจพอเพียง
ก.Price Mechanism
ข.e-commerce
ค.Mass Production
ง.Self Sufficiency Economic
เฉลย : ง

3. ปรัชญาเศรษฐกิจพอเพียงตรงกับความหมายของการปฏิบัติตนตามหลักธรรมใดในทางพระพุทธศาสนา
ก.มัชฌิมาปฏิปทา
ข.บุญกิริยาวัตถุ 3
ค.พุทธโอวาท 3
ง.อริยบุคคล 4
เฉลย : ก

4. พระราชดำรัสว่า “ความเจริญของคนทั้งหลายย่อมเกิดจากการประพฤติดีประพฤติชอบ หาเลี้ยงชีพในทางที่ชอบเป็นสำคัญ” ตรงกับความหมายของหลักธรรมใด
ก.สัมมาทิฏฐิ
ข.สัมมาวายามะ
ค.สัมมาอาชีวะ
ง.สัมมาสมาธิ
เฉลย : ค

5. เศรษฐกิจพอเพียงสอนให้ลดการพึ่งพาปัจจัยภายนอก ให้พึ่งตนเอง โดยบูรณาการทรัพยากรที่มีอยู่มาใช้ให้เกิดประโยชน์สูงสุด ตรงกับหลักธรรมใดในทางพระพุทธศาสนา
ก.ธัมมัญญุตา อัตถัญญุตา
ข.สันตุฏฐี ปะระมัง ธะนัง
ค.อัตตาหิ อัตตะโน นาโถ
ง.มัตตัญญุตา
เฉลย : ค

6. พอประมาณ มีเหตุผล มีภูมิคุ้มกัน ทุกการกระทำในการดำเนินชีวิต มีความสัมพันธ์กับหลักธรรมใดในพระพุทธศาสนา
ก.มัชฌิมาปฏิปทา
ข.ธัมมัญญุตา
ค.อัตถัญญุตา
ง.สันตุฏฐี ปะระมัง ธะนัง
เฉลย : ก

7. การพัฒนาในลักษณะใดที่เป็นการพัฒนาแบบไม่ยั่งยืน
ก.คนสัมพันธ์กับสิ่งแวดล้อมอย่างเอื้อเฟื้อเกื้อกูลกัน
ข.ใช้วิทยาศาสตร์และเทคโนโลยีเพื่อสร้างสรรค์ประโยชน์
ค.การพัฒนาที่มุ่งให้เกิดความสมดุลในด้านเศรษฐกิจ สังคม และสิ่งแวดล้อม
ง.การใช้ทรัพยากรที่มีอยู่มาพัฒนาความเจริญทางเศรษฐกิจให้มากที่สุด
เฉลย : ง

8. ข้อใดเป็นความหมายของหลักธรรม “สันตุฏฐี ปะระมัง ธะนัง” ตามหลักเศรษฐกิจพอเพียง
ก.พยายามไม่ก่อความชั่วให้เป็นเครื่องทำลายตัว ทำลายผู้อื่น
ข.ความสุขความเจริญอันแท้จริงนั้นต้องเกิดจากการแสวงหามาได้ด้วยความเป็นธรรม
ค.ความเป็นอยู่ที่ไม่ต้องฟุ่มเฟือย ต้องประหยัดในทางที่ถูกต้อง
ง.ความเจริญที่แท้จริงย่อมเกิดจากการประพฤติชอบ เลี้ยงชีพในทางที่ชอบเป็นสำคัญ
เฉลย : ค

9. การพัฒนาประเทศแบบยั่งยืน เหมาะกับการนำระบบเศรษฐกิจใดมาใช้
ก.ระบบทุนนิยม
ข.ระบบสังคมนิยม
ค.ระบบเศรษฐกิจแบบผสม
ง.ระบบเศรษฐกิจพอเพียง
เฉลย : ง

10. การพัฒนาแบบยั่งยืน มีความหมายตามข้อใด
ก.การเจริญเติบโตทางเศรษฐกิจ
ข.การเจริญทางเทคโนโลยี
ค.การพัฒนาความเจริญทางด้านอุตสาหกรรม
ง.การพัฒนาที่ไม่ก่อให้เกิดปัญหาตามมาอีกในอนาคต
เฉลย : ง

11. ปัญญาระดับใดเป็นปัญญาที่เกิดขึ้นเบื้องต้นของกระบวนการศึกษา
ก.สุตมยปัญญา
ข.จินตมยปัญญา
ค.ภาวนามยปัญญา
ง.วิปัสนาปัญญา
เฉลย : ก

12. มนุษย์เป็นสัตว์ประเสริฐด้วยการศึกษาเพราะเหตุผลตามข้อใด
ก.มีสัญชาตญาณในการดำเนินชีวิต
ข.จดจำคำสั่งได้ดี
ค.มีศักยภาพที่พัฒนาได้สูงสุด
ง.มีสัญชาตญาณในการฝึกหัด
เฉลย : ค

13. หลักพุทธธรรมที่เป็นเกณฑ์ในการพิจารณาปัญหาครอบคลุมทั้งระบบอย่างเป็นกระบวนการในการศึกษาคือหลักธรรมตามข้อใด
ก.อริยสัจ 4-ปฏิจจสมุปบาท
ข.มรรคมีองค์ 8
ค.สาราณียธรรม 6
ง.อปริหานิยธรรม 7
เฉลย : ก

14. ธรรมเป็นที่ตั้งแห่งการระลึกถึง มีความปรารถนาดีต่อกัน และเอื้อเฟื้อเกื้อกูลกัน เป็นความหมายของหลักธรรมในข้อใด
ก.สาราณียธรรม 6
ข.อริยสัจ 4
ค.พรหมวิหาร 4
ง.ทศพิธราชธรรม
เฉลย : ก

15. หลักธรรมใดเป็นปัจจัยกระตุ้นการเรียนรู้จากภายในตามแนวทางการจัดกระบวนการศึกษาแบบสัมมาทิฏฐิ
ก.ปรโตโฆสะ
ข.โยนิโสมนสิการ
ค.อัปปมาทธรรม
ง.กัลยาณมิตตตา
เฉลย : ข

16. ข้อใดเป็นความหมายของอปริหานิยธรรม ซึ่งเป็นหลักธรรมที่ใช้ในการปกครอง
ก.หลักเพื่อป้องกันมิให้การบริหารหมู่คณะเสื่อมถอย
ข.หลักธรรมที่เป็นที่ตั้งแห่งการระลึกถึงปรารถนาดีต่อกัน
ค.หลักธรรมเพื่อให้ยึดเหนี่ยวจิตใจของผู้อื่น
ง.หลักความประพฤติที่ประเสริฐบริสุทธิ์
เฉลย : ก

17. ข้อใดกล่าวถึงหลักธรรมพรหมวิหาร 4 ได้ถูกต้องมากที่สุด เกี่ยวกับการสร้างสังคมให้เกิดสันติภาพ
ก.เมตตาธรรมค้ำจุนโลก
ข.เมตตาธรรมนำสุข
ค.เมตตาธรรมปราบอธรรม
ง.เมตตาธรรมนำสังคมเจริญ
เฉลย : ก

18. ข้อใดเป็นความหมายของหลักจักรวรรดิวัตร
ก.พระราชกรณียกิจของพระราชา
ข.ธรรมเนียมการบำเพ็ญธรรมของนักปกครอง
ค.ธรรมเนียมการบำเพ็ญพระราชกรณียกิจของพระเจ้าจักรพรรดิ
ง.พระราชกรณียกิจของสมเด็จพระธรรมราชา
เฉลย : ค

19. การปกครองสังคมประเทศชาติให้เกิดสันติภาพ ผู้ปกครองจะต้องมีหลักธรรมตามข้อใด
ก.พรหมวิหารธรรม
ข.สาราณียธรรม
ค.อปริหานิยธรรม
ง.ทศพิธราชธรรม
เฉลย : ข

20. ข้อใดให้ความหมายราชสังคหวัตถุ 4 หลักการสังเคราะห์ประชาชนของพระราชาได้ไม่สัมพันธ์กับหัวข้อหลักธรรม
ก.สัสสเมธะ : ส่งเสริมการเกษตร
ข.ปุริสะเมธะ : ส่งเสริมคนดีมีความสามารถ
ค.สัมมาปาสะ : ผูกประสานรวมใจประชาชนด้วยการส่งเสริมอาชีพ
ง.วาชเปยะ : วาจามีอำนาจเป็นที่ยำเกรงของประชาชน
เฉลย : ง

21. หลักธรรมนิยามในข้อใดผิดจากความเป็นจริง
ก.อุตุนิยาม : กฎธรรมชาติเกี่ยวกับสภาพภูมิอากาศ
ข.พีชนิยาม : กฎธรรมชาติเกี่ยวกับการสืบพันธุ์
ค.จิตนิยาม : กฎธรรมชาติเกี่ยวกับด้านจิตวิทยา
ง.กรรมนิยาม : กฎธรรมชาติที่เกี่ยวกับพฤติกรรมของมนุษย์หรือกฎแห่งกรรม
เฉลย : ค

22. พระภิกษุรูปหนึ่งท่านมีนิสัยเอื้อเฟื้อเผื่อแผ่แก่ภิกษุรูปอื่นเสมอ ทำให้ท่านได้รับอานิสงส์คือ กลายเป็นผู้โชคดีในลาภสักการะโดยตลอด เป็นเพราะท่านปฏิบัติตามหลักธรรมใด
ก.โภคอาทิยะ 5
ข.อริยวัฑฒิ 5
ค.วุฒิธรรม 4
ง.สาราณียธรรม 6
เฉลย : ง

23. ผู้ที่ประกอบอาชีพค้าขายควรเน้นหลักธรรมใดไปปฏิบัติ
ก.วุฒิธรรม 4
ข.มิจฉาวณิชชา 5
ค.ปาปณิกธรรม 3
ง.พระสัทธรรม 3
เฉลย : ค

24. ธรรมในข้อใดที่ไม่ควรให้เกิดขึ้นซึ่งเป็นสิ่งที่ขวางกั้นความเจริญของจิตในการฝึกสติ
ก.นิวรณ์ 5
ข.มิจฉาวณิชชา 5
ค.วิตก 3
ง.โลกธรรม 8
เฉลย : ก

25. การประพฤติตนให้เป็นผู้มีระเบียบวินัยไม่ก่อความเดือดร้อน หรือเบียดเบียนผู้อื่น เป็นความหมายในข้อใด ของหมวดธรรมภาวนา 4
ก.กายภาวนา
ข.สีลภาวนา
ค.จิตตภาวนา
ง.ปัญญาภาวนา
เฉลย : ข

26. หลักธรรมใดเป็นการดำเนินไปสู่การดับทุกข์ได้ตามความหมายของอริยสัจ 4
ก.มรรคมีองค์ 8
ข.โลกธรรม 8
ค.ขันธ์ 5
ง.นิวรณ์ 5
เฉลย : ก

27. ข้อใดให้ความหมายพุทธศาสนสุภาษิตได้ถูกต้อง
ก.คำสุภาษิตของพระสงฆ์
ข.คำสุภาษิตของพระเถระผู้ใหญ่
ค.คำสุภาษิตของนักปราชญ์ทางพระพุทธศาสนา
ง.คำสุภาษิตทางพระพุทธศาสนา
เฉลย : ง

28. ธรรมในข้อใดที่เป็นธรรมหัวใจเศรษฐี คือ ทำให้บุคคลสามารถสร้างทรัพย์และรักษาทรัพย์ของตนเองให้ดำรงอยู่ได้
ก.อุบาสกธรรม 5
ข.โภคอาทิยะ 5
ค.อริยวัฑฒิ 5
ง.ทิฏฐธัมมิกัตถสังวัตตนิกธรรม 4
เฉลย : ข

29. การรู้จักความพอประมาณในปัจจัย 4 เป็นความหมายมงคล 38 ในข้อใด
ก.เขมํ
ข.ตโป
ค.สนฺตุฏฺฐี
ง.วิรชํ
เฉลย : ค

30. ในการศึกษาเล่าเรียน นักเรียนควรยึดพุทธศาสนสุภาษิตใดมาปฏิบัติ
ก.โกธํ ฆตฺวา สุขํ เสติ
ข.วายเมเถว ปุริโส ยาว อตฺถสฺส นิปฺปทา
ค.อิณาทานํ ทุกฺขํ โลเก
ง.จิตฺตํ ทนฺตํ สุขาวหํ
เฉลย : ข

31. ต้นคดปลายตรงเป็นลักษณะของพระสาวกรูปใด
ก.พระอานนท์
ข.พระอัสสชิ
ค.พระองคุลิมาล
ง.พระนาคเสน
เฉลย : ค

32. พระสาวกรูปใดที่มีความสัมพันธ์ในฐานะอาจารย์กับศิษย์
ก.พระอัสสชิ พระสารีบุตร
ข.พระสารีบุตร พระโมคคัลลานะ
ค.พระอานนท์ พระอนุรุทธะ
ง.พระนาคเสน พระยามิลินท์
เฉลย : ก

33. พระอานนท์ท่านเป็นผู้มีปฏิปทาแบบอย่างที่ดีทางด้านการศึกษาอย่างไร
ก.เป็นผู้มีความเพียรเป็นเลิศ
ข.เป็นผู้เลิศทางพหูสูต
ค.เป็นผู้เลิศทางด้านปัญญา
ง.เป็นผู้เลิศทางด้านอิทธิปาฏิหาริย์
เฉลย : ข

34. พระธรรมโกศาจารย์ (พุทธทาสภิกขุ) มีความสัมพันธ์กับข้อใด
ก.หนังสือพจนานุกรมพุทธศาสนา
ข.สวนโมกขพลาราม
ค.วัดหนองป่าพง
ง.หนังสือพุทธธรรม
เฉลย : ข

35. “ก่อนหน้านี้เธอเข้าใจว่าลูกของเธอเท่านั้นที่ตาย อันความตายนั้นเป็นของธรรมดาที่มีคู่กับสัตว์ทั้งหลายที่เกิดมาในโลก...” เป็นพระธรรมเทศนาที่พระพุทธเจ้าแสดงประทานแก่ใคร
ก.พระธัมมทินนาเถรี
ข.พระปฏาจาราเถรี
ค.พระอุบลวัณณาเถรี
ง.พระกีสาโคตมีเถรี
เฉลย : ง

36. พระอาจารย์มั่น ภูริทตฺโต เป็นแบบอย่างที่ดีของพระสงฆ์ทางด้านใด
ก.ผู้มุ่งมั่นปฏิบัติธรรมเจริญกรรมฐาน
ข.ผู้มุ่งมั่นศึกษาหาความรู้ทางด้านปริยัติจนแตกฉาน
ค.ผู้ฉลาดในการแต่งตำราทางพระพุทธศาสนา
ง.ผู้ที่เป็นแบบอย่างในการแสวงหาความเจริญทางการศึกษา
เฉลย : ก

37. พุทธศาสนิกชนตัวอย่างท่านใดเป็นบุคคลแรกที่นำเอาพระพุทธศาสนากลับมาสู่มาตุภูมิ ทำให้ชาวอินเดียจำนวนหลายล้านคนหันมานับถือพระพุทธศาสนา
ก.อนาคาริก ธรรมปาละ
ข.Dr. Ambedkar
ค.สุชีพ ปุญญานุภาพ
ง.มหาตมะคานธี
เฉลย : ก

38. ข้อคิดที่ได้จากการศึกษาประวัติของจูฬสุภัททาข้อใด ที่นักเรียนควรนำมาเป็นแบบอย่าง
ก.มีเมตตากรุณาต่อผู้อื่น
ข.มีความอดทนอดกลั้น
ค.มีความศรัทธา เลื่อมใสในพระพุทธศาสนา
ง.มีความใฝ่ใจในการศึกษาธรรม
เฉลย : ค

39. เหตุการณ์ในชาดกเรื่องใด ไม่สัมพันธ์กัน
ก.เวสสันดรชาดก : เป็นชาติที่พระพุทธเจ้าบำเพ็ญบารมีเป็นชาติสุดท้าย
ข.มโหสถชาดก : เป็นอดีตชาติที่พระพุทธเจ้าบำเพ็ญปัญญาบารมี
ค.มหาชนกชาดก : เป็นอดีตชาติที่พระพุทธเจ้าบำเพ็ญวิริยบารมี
ง.ชาดก : เป็นเรื่องราวที่พุทธสาวกนำมาประกอบการแสดงธรรม
เฉลย : ง

40. พระมหากษัตริย์พระองค์ใดที่ทรงมีพระทัยหนักแน่นในการนับถือพระพุทธศาสนา เห็นได้จากพระองค์ทรงปฏิเสธการเข้ารีตศาสนาคริสต์
ก.สมเด็จพระนารายณ์มหาราช
ข.พระบาทสมเด็จพระจุลจอมเกล้าเจ้าอยู่หัว
ค.พระบาทสมเด็จพระพุทธยอดฟ้าจุฬาโลกมหาราช
ง.สมเด็จพระเจ้าตากสินมหาราช
เฉลย : ก`);

  const [importTitle, setImportTitle] = useState('แบบทดสอบพระพุทธศาสนาและเศรษฐกิจพอเพียง (40 ข้อ)');
  const [importSubject, setImportSubject] = useState('สังคมศึกษา / พระพุทธศาสนา');
  const [importError, setImportError] = useState('');
  const [fileName, setFileName] = useState('');

  // Apps Script Export state
  const [scriptCode, setScriptCode] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Student test simulator state
  const [testAnswers, setTestAnswers] = useState<Record<string, any>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Editing modal state
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [tempQuestion, setTempQuestion] = useState<Question>({
    id: '',
    type: 'MULTIPLE_CHOICE',
    question: '',
    choices: ['ตัวเลือก ก', 'ตัวเลือก ข', 'ตัวเลือก ค', 'ตัวเลือก ง'],
    correctAnswer: 'ตัวเลือก ก',
    explanation: '',
    points: 1
  });

  useEffect(() => {
    localStorage.setItem('quizform_saved_exams_non_ai', JSON.stringify(savedExams));
  }, [savedExams]);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && !testSubmitted) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, testSubmitted]);

  // Handle File Upload (.txt, .docx, .pdf)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setImportError('');
    const ext = file.name.split('.').pop()?.toLowerCase();

    try {
      if (ext === 'txt') {
        const text = await file.text();
        setRawText(text);
      } else if (ext === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setRawText(result.value);
      } else if (ext === 'pdf') {
        // For PDF files, we can read text or prompt user if scanned. Let's read arrayBuffer or use FileReader
        const reader = new FileReader();
        reader.onload = async (event) => {
          const content = event.target?.result as string;
          // If binary PDF text extraction or fallback
          if (content) {
            // Simple text extraction from PDF binary stream or preview
            setRawText(content);
          }
        };
        // Read as text or use array buffer
        reader.readAsText(file);
      } else {
        // Generic reader
        const text = await file.text();
        setRawText(text);
      }
      setImportTitle(file.name.replace(/\.[^/.]+$/, ""));
    } catch (err: any) {
      setImportError('ไม่สามารถอ่านไฟล์ได้: ' + (err.message || 'รูปแบบไฟล์ไม่ถูกต้อง'));
    }
  };

  // Process text import and create exam
  const handleProcessImport = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError('');

    if (!rawText.trim()) {
      setImportError('กรุณากรอกหรืออัปโหลดเนื้อหาข้อสอบ');
      return;
    }

    const questions = parseExamTextToQuestions(rawText);
    if (questions.length === 0) {
      setImportError('ไม่พบรูปแบบคำถามในข้อความ กรุณาตรวจสอบรูปแบบ (เช่น 1. โจทย์... ก. ... ข. ... เฉลย: ...)');
      return;
    }

    const newExam: Exam = {
      id: 'exam-' + Date.now(),
      title: importTitle || 'แบบทดสอบนำเข้า',
      description: `นำเข้าอัตโนมัติจากไฟล์/ข้อความ วิชา ${importSubject}`,
      subject: importSubject,
      gradeLevel: 'มัธยมศึกษา',
      questions,
      createdAt: new Date().toISOString()
    };

    setCurrentExam(newExam);
    setActiveTab('editor');
  };

  // Generate Google Apps Script code
  const handleGenerateScript = async () => {
    setIsGeneratingScript(true);
    try {
      const res = await fetch('/api/generate-apps-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentExam.title,
          description: currentExam.description,
          questions: currentExam.questions
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setScriptCode(data.scriptCode);
      setActiveTab('export');
    } catch (err: any) {
      alert('เกิดข้อผิดพลาดในการสร้าง Apps Script: ' + err.message);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleSaveExam = () => {
    const existsIndex = savedExams.findIndex(ex => ex.id === currentExam.id);
    if (existsIndex >= 0) {
      const updated = [...savedExams];
      updated[existsIndex] = currentExam;
      setSavedExams(updated);
    } else {
      setSavedExams([currentExam, ...savedExams]);
    }
    alert('บันทึกข้อสอบลงในคลังข้อสอบเรียบร้อยแล้ว!');
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentExam, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${currentExam.title.replace(/[^ก-๙a-z0-9]/gi, '_').toLowerCase()}_quiz.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleStartTest = () => {
    setTestAnswers({});
    setTestSubmitted(false);
    setTestScore(0);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setActiveTab('preview');
  };

  const handleSubmitTest = () => {
    setIsTimerRunning(false);
    let score = 0;

    currentExam.questions.forEach(q => {
      const userAns = testAnswers[q.id];
      if (q.type === 'MULTIPLE_SELECT') {
        const correctArr = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
        const userArr = Array.isArray(userAns) ? userAns : [userAns];
        const isMatch = correctArr.length === userArr.length && correctArr.every(ans => userArr.includes(ans));
        if (isMatch) score += (q.points || 1);
      } else {
        if (userAns && userAns.toString().trim().toLowerCase() === q.correctAnswer.toString().trim().toLowerCase()) {
          score += (q.points || 1);
        }
      }
    });

    setTestScore(score);
    setTestSubmitted(true);
  };

  const openAddQuestionModal = () => {
    setTempQuestion({
      id: 'q-' + Date.now(),
      type: 'MULTIPLE_CHOICE',
      question: '',
      choices: ['ตัวเลือก ก', 'ตัวเลือก ข', 'ตัวเลือก ค', 'ตัวเลือก ง'],
      correctAnswer: 'ตัวเลือก ก',
      explanation: '',
      points: 1
    });
    setEditingQuestionIndex(null);
    setEditModalOpen(true);
  };

  const openEditQuestionModal = (index: number) => {
    setEditingQuestionIndex(index);
    setTempQuestion({ ...currentExam.questions[index] });
    setEditModalOpen(true);
  };

  const saveQuestionFromModal = () => {
    if (!tempQuestion.question.trim()) {
      alert('กรุณากรอกโจทย์คำถาม');
      return;
    }
    const updatedQuestions = [...currentExam.questions];
    if (editingQuestionIndex !== null) {
      updatedQuestions[editingQuestionIndex] = tempQuestion;
    } else {
      updatedQuestions.push(tempQuestion);
    }
    setCurrentExam({ ...currentExam, questions: updatedQuestions });
    setEditModalOpen(false);
  };

  const deleteQuestion = (index: number) => {
    if (confirm('คุณต้องการลบข้อคำถามนี้ใช่หรือไม่?')) {
      const updatedQuestions = currentExam.questions.filter((_, i) => i !== index);
      setCurrentExam({ ...currentExam, questions: updatedQuestions });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('importer')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
                QuizForm Creator
              </h1>
              <p className="text-xs text-slate-500 font-medium">นำเข้าข้อสอบจาก Text, Word, PDF พร้อมเฉลย</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('importer')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'importer' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>นำเข้าไฟล์ / ข้อความ</span>
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'editor' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>จัดการข้อสอบ ({currentExam.questions.length})</span>
            </button>
            <button
              onClick={handleGenerateScript}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'export' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>ส่งออก Google Form</span>
            </button>
            <button
              onClick={handleStartTest}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'preview' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>ทดลองทำข้อสอบ</span>
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'bank' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>คลังข้อสอบ ({savedExams.length})</span>
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSaveExam}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">บันทึกข้อสอบ</span>
            </button>
            <button
              onClick={handleGenerateScript}
              disabled={isGeneratingScript || currentExam.questions.length === 0}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-semibold shadow-md shadow-indigo-200 transition flex items-center space-x-2 disabled:opacity-50"
            >
              {isGeneratingScript ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Code2 className="w-4 h-4" />}
              <span>สร้าง Google Form</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around bg-white border-t border-slate-200 py-2 px-1">
          <button onClick={() => setActiveTab('importer')} className={`flex flex-col items-center text-xs ${activeTab === 'importer' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
            <Upload className="w-5 h-5 mb-0.5" />
            <span>นำเข้า</span>
          </button>
          <button onClick={() => setActiveTab('editor')} className={`flex flex-col items-center text-xs ${activeTab === 'editor' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
            <Edit3 className="w-5 h-5 mb-0.5" />
            <span>จัดการ</span>
          </button>
          <button onClick={handleGenerateScript} className={`flex flex-col items-center text-xs ${activeTab === 'export' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
            <Code2 className="w-5 h-5 mb-0.5" />
            <span>Google Form</span>
          </button>
          <button onClick={handleStartTest} className={`flex flex-col items-center text-xs ${activeTab === 'preview' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
            <PlayCircle className="w-5 h-5 mb-0.5" />
            <span>ทดสอบ</span>
          </button>
          <button onClick={() => setActiveTab('bank')} className={`flex flex-col items-center text-xs ${activeTab === 'bank' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
            <FolderOpen className="w-5 h-5 mb-0.5" />
            <span>คลัง</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* TAB 1: FILE / TEXT IMPORTER */}
        {activeTab === 'importer' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <div className="text-center space-y-3">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold tracking-wide uppercase">
                <FileUp className="w-3.5 h-3.5" />
                <span>นำเข้าไฟล์ Word (.docx), PDF หรือ Text อัตโนมัติ</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                อัปโหลดไฟล์ข้อสอบพร้อมเฉลย
              </h2>
              <p className="text-slate-600 text-base max-w-2xl mx-auto">
                รองรับการอัปโหลดไฟล์เอกสาร Word (.docx), PDF, Text (.txt) หรือคัดลอกข้อความมาวาง ระบบจะทำการแปลงโจทย์ ตัวเลือก และเฉลยเป็นชุดข้อสอบให้อัตโนมัติทันที
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-200/80 p-6 sm:p-8 space-y-6">
              
              {/* File Upload Box */}
              <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-2xl p-8 text-center bg-indigo-50/30 transition relative group">
                <input
                  type="file"
                  accept=".txt,.docx,.pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition shadow-sm">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  {fileName ? `อัปโหลดไฟล์สำเร็จ: ${fileName}` : 'คลิกเพื่ออัปโหลดไฟล์ หรือลากไฟล์มาวางที่นี่'}
                </h3>
                <p className="text-xs text-slate-500">
                  รองรับไฟล์ Word (.docx), PDF และ Text (.txt) ที่มีโจทย์ ตัวเลือก และเฉลย
                </p>
              </div>

              <form onSubmit={handleProcessImport} className="space-y-6 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">ชื่อชุดข้อสอบ</label>
                    <input
                      type="text"
                      value={importTitle}
                      onChange={e => setImportTitle(e.target.value)}
                      placeholder="เช่น แบบทดสอบปลายภาค วิชาชีววิทยา"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm font-medium outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">กลุ่มสาระการเรียนรู้ / วิชา</label>
                    <input
                      type="text"
                      value={importSubject}
                      onChange={e => setImportSubject(e.target.value)}
                      placeholder="เช่น วิทยาศาสตร์, คณิตศาสตร์"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm font-medium outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-slate-700">เนื้อหาข้อสอบ (สามารถแก้ไขข้อความหรือวางข้อความเพิ่มได้)</label>
                    <span className="text-xs text-slate-400 font-medium">รูปแบบ: 1. โจทย์... ก. ... ข. ... เฉลย: ...</span>
                  </div>
                  <textarea
                    rows={8}
                    value={rawText}
                    onChange={e => setRawText(e.target.value)}
                    placeholder="วางข้อความข้อสอบที่นี่..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-slate-800 text-sm font-mono leading-relaxed outline-none transition"
                    required
                  />
                </div>

                {importError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center space-x-3 text-red-700 text-sm font-medium">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{importError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-base shadow-lg shadow-indigo-200 transition flex items-center justify-center space-x-2"
                >
                  <FileCheck className="w-5 h-5" />
                  <span>ประมวลผลและสร้างชุดข้อสอบอัตโนมัติ</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: EXAM EDITOR */}
        {activeTab === 'editor' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 flex-1">
                <input
                  type="text"
                  value={currentExam.title}
                  onChange={e => setCurrentExam({ ...currentExam, title: e.target.value })}
                  className="text-2xl font-extrabold text-slate-900 w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-none transition"
                  placeholder="ชื่อชุดข้อสอบ"
                />
                <input
                  type="text"
                  value={currentExam.description}
                  onChange={e => setCurrentExam({ ...currentExam, description: e.target.value })}
                  className="text-sm text-slate-600 w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-none transition"
                  placeholder="คำอธิบายข้อสอบ"
                />
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={openAddQuestionModal}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มข้อสอบ</span>
                </button>
                <button
                  onClick={handleGenerateScript}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition flex items-center space-x-1.5"
                >
                  <Code2 className="w-4 h-4" />
                  <span>สร้าง Google Form</span>
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {currentExam.questions.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                  <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-800">ยังไม่มีข้อสอบในชุดนี้</h3>
                  <p className="text-sm text-slate-500 mb-4">เพิ่มข้อสอบด้วยตนเองหรือไปที่หน้า "นำเข้าไฟล์"</p>
                  <button
                    onClick={openAddQuestionModal}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold"
                  >
                    เพิ่มข้อแรก
                  </button>
                </div>
              ) : (
                currentExam.questions.map((q, index) => (
                  <div key={q.id || index} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 hover:shadow-md transition">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold text-sm flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold mb-1">
                            {q.type === 'MULTIPLE_CHOICE' ? 'ปรนัย 4 ตัวเลือก' : q.type === 'TRUE_FALSE' ? 'ถูก / ผิด' : q.type === 'MULTIPLE_SELECT' ? 'เลือกตอบหลายข้อ' : 'เติมคำตอบสั้นๆ'}
                          </span>
                          <span className="ml-2 text-xs text-slate-500 font-semibold">{q.points || 1} คะแนน</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => openEditQuestionModal(index)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition"
                          title="แก้ไขข้อสอบ"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteQuestion(index)}
                          className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition"
                          title="ลบข้อสอบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mb-3">{q.question}</h4>

                    {q.type !== 'SHORT_ANSWER' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                        {q.choices.map((choice, cIdx) => {
                          const isCorrect = Array.isArray(q.correctAnswer)
                            ? q.correctAnswer.includes(choice)
                            : choice === q.correctAnswer;
                          return (
                            <div
                              key={cIdx}
                              className={`p-3 rounded-xl text-sm font-medium flex items-center justify-between border ${
                                isCorrect 
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' 
                                  : 'bg-slate-50 border-slate-200 text-slate-700'
                              }`}
                            >
                              <span>{choice}</span>
                              {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'SHORT_ANSWER' && (
                      <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm font-medium text-emerald-900">
                        <span className="font-bold">เฉลยคำตอบ: </span> {q.correctAnswer}
                      </div>
                    )}

                    {q.explanation && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start space-x-2">
                        <BookOpen className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-700">คำอธิบาย/เหตุผล: </span>
                          <span>{q.explanation}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: GOOGLE FORMS EXPORT & APPS SCRIPT */}
        {activeTab === 'export' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900">ส่งออกไปยัง Google Forms อัตโนมัติ</h2>
              <p className="text-slate-600 text-sm">
                สร้าง Google Form พร้อมเฉลย คะแนน และตั้งค่าเป็น Quiz ทันทีผ่าน Google Apps Script
              </p>
            </div>

            {/* Apps Script Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Google Apps Script (`Code.gs`)</h3>
                    <p className="text-xs text-slate-500">สร้าง Google Form พร้อมเฉลยและตั้งค่า Quiz โดยอัตโนมัติ</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(scriptCode);
                    setCopiedScript(true);
                    setTimeout(() => setCopiedScript(false), 2000);
                  }}
                  disabled={!scriptCode}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm transition flex items-center space-x-2 disabled:opacity-50"
                >
                  {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedScript ? 'คัดลอกสคริปต์แล้ว!' : 'คัดลอก Google Apps Script'}</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto max-h-96 text-xs text-emerald-400 font-mono leading-relaxed">
                  <pre>{scriptCode || '// คลิกปุ่ม "สร้าง Google Form" ในหน้าจัดการหรือเมนูด้านบนเพื่อสร้างโค้ดสคริปต์'}</pre>
                </div>

                <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 space-y-3">
                  <h4 className="font-bold text-indigo-900 text-sm flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span>วิธีนำโค้ดไปสร้าง Google Form ใน Google Drive (ใช้เวลา 30 วินาที):</span>
                  </h4>
                  <ol className="list-decimal list-inside text-xs text-indigo-800 space-y-1.5 font-medium">
                    <li>ไปที่เว็บไซต์ <a href="https://script.google.com" target="_blank" rel="noreferrer" className="underline font-bold">script.google.com</a> แล้วคลิก <span className="font-bold">โปรเจกต์ใหม่ (New Project)</span></li>
                    <li>ลบโค้ดเดิมออกทั้งหมด แล้ววางโค้ด <span className="font-bold">Code.gs</span> ที่คัดลอกมาจากด้านบนลงไป</li>
                    <li>คลิกปุ่ม <span className="font-bold">เรียกใช้ (Run)</span> ด้านบน (หากระบบขอสิทธิ์เข้าถึง ให้เลือกบัญชี Google ของท่าน คลิก "ขั้นสูง" และ "ดำเนินการต่อ")</li>
                    <li>ไปที่ <a href="https://drive.google.com" target="_blank" rel="noreferrer" className="underline font-bold">Google Drive</a> ของท่าน จะพบ Google Form พร้อมโจทย์ ตัวเลือก คะแนน และเฉลยถูกสร้างให้อัตโนมัติ!</li>
                  </ol>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <button
                  onClick={handleDownloadJSON}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold transition flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>ดาวน์โหลดไฟล์ JSON สำรองข้อมูล</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold transition flex items-center justify-center space-x-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>พิมพ์กระดาษข้อสอบและเฉลย</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STUDENT QUIZ SIMULATOR MODE */}
        {activeTab === 'preview' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                  โหมดทดลองทำข้อสอบ (Student Mode)
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">{currentExam.title}</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>เวลา {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')} นาที</span>
                </div>
              </div>
            </div>

            {testSubmitted && (
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-xl text-center space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-extrabold">ส่งข้อสอบเรียบร้อยแล้ว!</h3>
                <p className="text-indigo-100 text-lg">
                  คะแนนที่คุณทำได้: <span className="font-extrabold text-white underline">{testScore}</span> / {currentExam.questions.reduce((acc, q) => acc + (q.points || 1), 0)} คะแนน
                </p>
                <button
                  onClick={() => {
                    setTestSubmitted(false);
                    setTestAnswers({});
                    setTimerSeconds(0);
                    setIsTimerRunning(true);
                  }}
                  className="px-6 py-3 rounded-xl bg-white text-indigo-700 font-bold text-sm shadow-md hover:bg-indigo-50 transition"
                >
                  ทำข้อสอบใหม่อีกครั้ง
                </button>
              </div>
            )}

            <div className="space-y-6">
              {currentExam.questions.map((q, index) => {
                const userAns = testAnswers[q.id];
                const isCorrect = testSubmitted && (
                  q.type === 'MULTIPLE_SELECT' 
                    ? Array.isArray(q.correctAnswer) && Array.isArray(userAns) && q.correctAnswer.length === userAns.length && q.correctAnswer.every(a => userAns.includes(a))
                    : userAns && userAns.toString().trim().toLowerCase() === q.correctAnswer.toString().trim().toLowerCase()
                );

                return (
                  <div key={q.id || index} className={`bg-white rounded-2xl border p-6 shadow-xs transition ${
                    testSubmitted ? (isCorrect ? 'border-emerald-300 bg-emerald-50/20' : 'border-red-300 bg-red-50/20') : 'border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-extrabold text-slate-500">ข้อที่ {index + 1} จาก {currentExam.questions.length} ข้อ</span>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">{q.points || 1} คะแนน</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mb-4">{q.question}</h4>

                    {q.type !== 'SHORT_ANSWER' && (
                      <div className="space-y-2.5">
                        {q.choices.map((choice, cIdx) => {
                          const isSelected = q.type === 'MULTIPLE_SELECT' 
                            ? Array.isArray(userAns) && userAns.includes(choice)
                            : userAns === choice;

                          return (
                            <label
                              key={cIdx}
                              className={`flex items-center p-3.5 rounded-xl border cursor-pointer transition ${
                                isSelected 
                                  ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold' 
                                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
                              }`}
                            >
                              <input
                                type={q.type === 'MULTIPLE_SELECT' ? 'checkbox' : 'radio'}
                                name={`q-${q.id}`}
                                checked={isSelected}
                                disabled={testSubmitted}
                                onChange={() => {
                                  if (q.type === 'MULTIPLE_SELECT') {
                                    const currentArr = Array.isArray(userAns) ? userAns : [];
                                    const newArr = currentArr.includes(choice) ? currentArr.filter(x => x !== choice) : [...currentArr, choice];
                                    setTestAnswers({ ...testAnswers, [q.id]: newArr });
                                  } else {
                                    setTestAnswers({ ...testAnswers, [q.id]: choice });
                                  }
                                }}
                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 mr-3"
                              />
                              <span className="text-sm">{choice}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'SHORT_ANSWER' && (
                      <input
                        type="text"
                        disabled={testSubmitted}
                        value={userAns || ''}
                        onChange={e => setTestAnswers({ ...testAnswers, [q.id]: e.target.value })}
                        placeholder="พิมพ์คำตอบของคุณที่นี่..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-medium outline-none bg-white"
                      />
                    )}

                    {testSubmitted && (
                      <div className={`mt-4 p-4 rounded-xl text-xs space-y-1 ${isCorrect ? 'bg-emerald-100 text-emerald-900 font-medium' : 'bg-red-100 text-red-900 font-medium'}`}>
                        <div className="font-bold flex items-center space-x-1.5">
                          {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <AlertCircle className="w-4 h-4 text-red-700" />}
                          <span>{isCorrect ? 'ถูกต้อง!' : 'ยังไม่ถูกต้อง'}</span>
                        </div>
                        <div><strong className="font-bold">เฉลย:</strong> {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}</div>
                        {q.explanation && <div><strong className="font-bold">คำอธิบาย:</strong> {q.explanation}</div>}
                      </div>
                    )}
                  </div>
                );
              })}

              {!testSubmitted && (
                <button
                  onClick={handleSubmitTest}
                  className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-200 transition"
                >
                  ส่งคำตอบและตรวจคะแนน
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: QUESTION BANK / SAVED EXAMS */}
        {activeTab === 'bank' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900">คลังข้อสอบที่บันทึกไว้</h2>
                <p className="text-slate-600 text-sm">จัดการ โหลด หรือแก้ไขชุดข้อสอบทั้งหมดที่เคยสร้างไว้</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedExams.map((exam) => (
                <div key={exam.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold">
                        {exam.subject} ({exam.gradeLevel})
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(exam.createdAt).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{exam.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{exam.description}</p>
                    <div className="text-xs font-semibold text-slate-600">
                      จำนวน {exam.questions.length} ข้อ
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setCurrentExam(exam);
                        setActiveTab('editor');
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center justify-center space-x-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>เปิดแก้ไข</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentExam(exam);
                        handleStartTest();
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center space-x-1"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>ทดสอบ</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('คุณต้องการลบชุดข้อสอบนี้ออกจากคลังใช่หรือไม่?')) {
                          setSavedExams(savedExams.filter(e => e.id !== exam.id));
                        }
                      }}
                      className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition"
                      title="ลบข้อสอบ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* EDIT / ADD QUESTION MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-900">
                {editingQuestionIndex !== null ? 'แก้ไขข้อสอบ' : 'เพิ่มข้อสอบใหม่'}
              </h3>
              <button 
                onClick={() => setEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ประเภทคำถาม</label>
                  <select
                    value={tempQuestion.type}
                    onChange={e => {
                      const newType = e.target.value as any;
                      let defaultChoices = tempQuestion.choices;
                      if (newType === 'TRUE_FALSE') defaultChoices = ['จริง', 'เท็จ'];
                      else if (newType === 'SHORT_ANSWER') defaultChoices = [];
                      else if (defaultChoices.length === 0) defaultChoices = ['ตัวเลือก 1', 'ตัวเลือก 2', 'ตัวเลือก 3', 'ตัวเลือก 4'];
                      
                      setTempQuestion({
                        ...tempQuestion,
                        type: newType,
                        choices: defaultChoices,
                        correctAnswer: newType === 'TRUE_FALSE' ? 'จริง' : newType === 'SHORT_ANSWER' ? '' : defaultChoices[0]
                      });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium outline-none bg-white"
                  >
                    <option value="MULTIPLE_CHOICE">ปรนัย 4 ตัวเลือก</option>
                    <option value="TRUE_FALSE">ถูก / ผิด</option>
                    <option value="MULTIPLE_SELECT">เลือกตอบหลายข้อ (Checkboxes)</option>
                    <option value="SHORT_ANSWER">เติมคำตอบสั้นๆ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">คะแนน</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={tempQuestion.points}
                    onChange={e => setTempQuestion({ ...tempQuestion, points: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">โจทย์คำถาม</label>
                <textarea
                  rows={3}
                  value={tempQuestion.question}
                  onChange={e => setTempQuestion({ ...tempQuestion, question: e.target.value })}
                  placeholder="พิมพ์โจทย์คำถามที่นี่..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium outline-none"
                />
              </div>

              {tempQuestion.type !== 'SHORT_ANSWER' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">ตัวเลือก (กำหนดคำตอบที่ถูกต้องด้วย)</label>
                  {tempQuestion.choices.map((choice, cIdx) => (
                    <div key={cIdx} className="flex items-center space-x-2">
                      <input
                        type={tempQuestion.type === 'MULTIPLE_SELECT' ? 'checkbox' : 'radio'}
                        name="correctChoice"
                        checked={
                          Array.isArray(tempQuestion.correctAnswer)
                            ? tempQuestion.correctAnswer.includes(choice)
                            : tempQuestion.correctAnswer === choice
                        }
                        onChange={() => {
                          if (tempQuestion.type === 'MULTIPLE_SELECT') {
                            const currentCorrect = Array.isArray(tempQuestion.correctAnswer) ? tempQuestion.correctAnswer : [];
                            const newCorrect = currentCorrect.includes(choice)
                              ? currentCorrect.filter(c => c !== choice)
                              : [...currentCorrect, choice];
                            setTempQuestion({ ...tempQuestion, correctAnswer: newCorrect });
                          } else {
                            setTempQuestion({ ...tempQuestion, correctAnswer: choice });
                          }
                        }}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <input
                        type="text"
                        value={choice}
                        onChange={e => {
                          const updatedChoices = [...tempQuestion.choices];
                          updatedChoices[cIdx] = e.target.value;
                          setTempQuestion({ ...tempQuestion, choices: updatedChoices });
                        }}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedChoices = tempQuestion.choices.filter((_, i) => i !== cIdx);
                          setTempQuestion({ ...tempQuestion, choices: updatedChoices });
                        }}
                        className="p-2 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setTempQuestion({
                        ...tempQuestion,
                        choices: [...tempQuestion.choices, `ตัวเลือกที่ ${tempQuestion.choices.length + 1}`]
                      });
                    }}
                    className="text-xs font-bold text-indigo-600 hover:underline pt-1"
                  >
                    + เพิ่มตัวเลือก
                  </button>
                </div>
              )}

              {tempQuestion.type === 'SHORT_ANSWER' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">เฉลยคำตอบสั้นๆ</label>
                  <input
                    type="text"
                    value={tempQuestion.correctAnswer as string}
                    onChange={e => setTempQuestion({ ...tempQuestion, correctAnswer: e.target.value })}
                    placeholder="พิมพ์เฉลยคำตอบ..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">คำอธิบายหรือเหตุผล (แสดงหลังส่งข้อสอบ)</label>
                <textarea
                  rows={2}
                  value={tempQuestion.explanation}
                  onChange={e => setTempQuestion({ ...tempQuestion, explanation: e.target.value })}
                  placeholder="อธิบายเพิ่มเติมว่าเหตุใดจึงตอบข้อนี้..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={saveQuestionFromModal}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm"
                >
                  บันทึกคำถาม
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
