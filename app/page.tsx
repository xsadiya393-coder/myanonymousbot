"use client";

import { useState } from "react";

type Lang = "bn" | "en" | "hi" | "ur" | "ru" | "zh" | "ar";

type FormData = {
  name: string;
  number1: string;
  number2: string;
  age: string;
  gmail1: string;
  gmail2: string;
  accepted: boolean;
};



const T = {
  bn: {
    lang: "ভাষা", application: "আবেদন", preview: "প্রিভিউ", title: "আপনার তথ্য জমা দিন", previewTitle: "আবেদনটি যাচাই করুন",
    subtitle: "ফর্মটি পূরণ করে জমা দেওয়ার আগে তথ্যগুলো যাচাই করুন।", previewSub: "পাঠানোর আগে আপনার তথ্যগুলো দেখে নিন।",
    important: "গুরুত্বপূর্ণ তথ্য", notice1: "এই আবেদনটি শিক্ষামূলক/পরীক্ষামূলক উদ্দেশ্যে ব্যবহার করা হতে পারে। নিচে চাওয়া তথ্যই শুধু দিন। পাসওয়ার্ড, OTP, recovery code বা ব্যাংকিং তথ্য দেবেন না। আপনার জমা দেওয়া তথ্য ও নথি পর্যালোচনার জন্য প্রশাসকের Telegram-এ পাঠানো হবে।",
    notice2: "এই ওয়েব ফর্ম আপনার ফোনের ঠিকানা/লোকেশন, SIM বা Gmail account গোপনে পড়ে নেয়—এমন দাবি করা হচ্ছে না। কোনো বাস্তব verification থাকলে তা স্পষ্টভাবে জানানো হবে।",
    name: "নাম", number1: "নম্বর ১", number2: "নম্বর ২", age: "বয়স", gmail1: "Gmail ১", gmail2: "Gmail ২",
    accept: "আমি আবেদনের নিয়ম ও privacy notice পড়েছি এবং সম্মত আছি।", documents: "ডকুমেন্ট", fileHelp: "PDF, JPG, PNG, WEBP · প্রতিটি সর্বোচ্চ ১০ MB · সর্বোচ্চ ৮টি ফাইল",
    remove: "মুছুন", continue: "প্রিভিউতে যান", edit: "সম্পাদনা", confirm: "নিশ্চিত করে জমা দিন", sending: "পাঠানো হচ্ছে…", rules: "নিয়ম", accepted: "সম্মত", notAccepted: "সম্মত নয়",
    noDocs: "কোনো ডকুমেন্ট যুক্ত করা হয়নি।", privacy: "শুধু প্রয়োজনীয় ও শেয়ার করতে স্বাচ্ছন্দ্যবোধ করেন এমন তথ্য দিন। কখনো password বা one-time code জমা দেবেন না।",
    submitted: "সফলভাবে জমা হয়েছে।", submitFailed: "জমা দেওয়া ব্যর্থ হয়েছে।", invalidG1: "সঠিক Gmail ১ দিন।", invalidG2: "সঠিক Gmail ২ দিন।", required: "সব প্রয়োজনীয় তথ্য পূরণ করুন।", rulesErr: "নিয়মে সম্মতি দিতে হবে।", sizeErr: "সব ফাইল মিলিয়ে সর্বোচ্চ ৪০ MB হতে পারবে।", typeErr: "এই ফাইলের ধরন অনুমোদিত নয়:", largeErr: "ফাইলটি ১০ MB-এর বেশি:",
  },
  en: {
    lang: "Language", application: "APPLICATION", preview: "PREVIEW", title: "Submit your information", previewTitle: "Review your application",
    subtitle: "Complete the form and review it before submission.", previewSub: "Check the information before sending.", important: "Important information",
    notice1: "This application may be used for educational/testing purposes. Submit only the information requested below. Do not enter passwords, verification codes, recovery codes, or banking information. Your submitted information and documents will be sent to the administrator through Telegram for review.",
    notice2: "We do not claim that this web form secretly reads your phone address/location, SIM, or Gmail account. Any actual verification will be explicitly disclosed.",
    name: "Name", number1: "Number 1", number2: "Number 2", age: "Age", gmail1: "Gmail 1", gmail2: "Gmail 2", accept: "I have read and accept the application's rules and privacy notice.", documents: "Documents", fileHelp: "PDF, JPG, PNG, WEBP · up to 10 MB each · 8 files", remove: "Remove", continue: "Continue to Preview", edit: "Edit", confirm: "Confirm & Submit", sending: "Sending…", rules: "Rules", accepted: "Accepted", notAccepted: "Not accepted", noDocs: "No documents attached.", privacy: "Only submit information you are comfortable sharing for the stated purpose. Never submit passwords or one-time codes.", submitted: "Submitted successfully.", submitFailed: "Submission failed.", invalidG1: "Enter a valid Gmail 1 address.", invalidG2: "Enter a valid Gmail 2 address.", required: "Please complete all required fields.", rulesErr: "You must accept the rules.", sizeErr: "Total upload size must be 40 MB or less.", typeErr: "Unsupported file type:", largeErr: "File is larger than 10 MB:",
  },
  hi: { lang:"भाषा", application:"आवेदन", preview:"पूर्वावलोकन", title:"अपनी जानकारी जमा करें", previewTitle:"आवेदन की जाँच करें", subtitle:"फॉर्म भरें और जमा करने से पहले जानकारी जाँचें।", previewSub:"भेजने से पहले जानकारी देखें।", important:"महत्वपूर्ण जानकारी", notice1:"यह आवेदन शैक्षिक/परीक्षण उद्देश्य के लिए हो सकता है। केवल माँगी गई जानकारी दें। पासवर्ड, OTP, recovery code या बैंकिंग जानकारी न दें। आपकी जानकारी और दस्तावेज़ समीक्षा के लिए व्यवस्थापक के Telegram पर भेजे जाएंगे।", notice2:"यह वेब फॉर्म आपके फोन का पता/लोकेशन, SIM या Gmail account गुप्त रूप से पढ़ने का दावा नहीं करता। कोई वास्तविक verification हो तो उसे स्पष्ट रूप से बताया जाएगा।", name:"नाम", number1:"नंबर 1", number2:"नंबर 2", age:"उम्र", gmail1:"Gmail 1", gmail2:"Gmail 2", accept:"मैंने नियम और privacy notice पढ़कर स्वीकार किया है।", documents:"दस्तावेज़", fileHelp:"PDF, JPG, PNG, WEBP · प्रत्येक 10 MB तक · 8 फाइलें", remove:"हटाएँ", continue:"पूर्वावलोकन पर जाएँ", edit:"संपादित करें", confirm:"पुष्टि करके जमा करें", sending:"भेजा जा रहा है…", rules:"नियम", accepted:"स्वीकार", notAccepted:"स्वीकार नहीं", noDocs:"कोई दस्तावेज़ नहीं जोड़ा गया।", privacy:"केवल वही जानकारी दें जिसे साझा करने में आपको सुविधा हो। पासवर्ड या one-time code कभी न दें।", submitted:"सफलतापूर्वक जमा हुआ।", submitFailed:"जमा करना विफल हुआ।", invalidG1:"सही Gmail 1 दर्ज करें।", invalidG2:"सही Gmail 2 दर्ज करें।", required:"सभी आवश्यक फ़ील्ड भरें।", rulesErr:"नियम स्वीकार करना आवश्यक है।", sizeErr:"कुल अपलोड 40 MB या कम होना चाहिए।", typeErr:"असमर्थित फ़ाइल प्रकार:", largeErr:"फाइल 10 MB से बड़ी है:" },
  ur: { lang:"زبان", application:"درخواست", preview:"پیش نظارہ", title:"اپنی معلومات جمع کریں", previewTitle:"اپنی درخواست چیک کریں", subtitle:"فارم مکمل کریں اور جمع کرنے سے پہلے معلومات دیکھیں۔", previewSub:"بھیجنے سے پہلے معلومات چیک کریں۔", important:"اہم معلومات", notice1:"یہ درخواست تعلیمی/ٹیسٹنگ مقصد کے لیے استعمال ہو سکتی ہے۔ صرف مطلوبہ معلومات دیں۔ پاس ورڈ، OTP، recovery code یا بینکنگ معلومات نہ دیں۔ آپ کی معلومات اور دستاویزات جائزے کے لیے منتظم کے Telegram پر بھیجی جائیں گی۔", notice2:"یہ ویب فارم آپ کے فون کا پتہ/لوکیشن، SIM یا Gmail account خفیہ طور پر پڑھنے کا دعویٰ نہیں کرتا۔ کسی حقیقی verification کو واضح کیا جائے گا۔", name:"نام", number1:"نمبر 1", number2:"نمبر 2", age:"عمر", gmail1:"Gmail 1", gmail2:"Gmail 2", accept:"میں نے قواعد اور privacy notice پڑھ کر قبول کیا ہے۔", documents:"دستاویزات", fileHelp:"PDF, JPG, PNG, WEBP · ہر فائل 10 MB تک · 8 فائلیں", remove:"حذف کریں", continue:"پیش نظارہ", edit:"ترمیم", confirm:"تصدیق اور جمع کریں", sending:"بھیجا جا رہا ہے…", rules:"قواعد", accepted:"قبول", notAccepted:"قبول نہیں", noDocs:"کوئی دستاویز منسلک نہیں۔", privacy:"صرف وہ معلومات دیں جسے شیئر کرنے میں آپ مطمئن ہوں۔ پاس ورڈ یا one-time code کبھی نہ دیں۔", submitted:"کامیابی سے جمع ہو گیا۔", submitFailed:"جمع کرنا ناکام ہوا۔", invalidG1:"درست Gmail 1 درج کریں۔", invalidG2:"درست Gmail 2 درج کریں۔", required:"تمام ضروری فیلڈز مکمل کریں۔", rulesErr:"قواعد قبول کرنا ضروری ہے۔", sizeErr:"کل اپلوڈ 40 MB یا کم ہونا چاہیے۔", typeErr:"غیر معاون فائل قسم:", largeErr:"فائل 10 MB سے بڑی ہے:" },
  ru: { lang:"Язык", application:"ЗАЯВКА", preview:"ПРЕДПРОСМОТР", title:"Отправьте свою информацию", previewTitle:"Проверьте заявку", subtitle:"Заполните форму и проверьте данные перед отправкой.", previewSub:"Проверьте данные перед отправкой.", important:"Важная информация", notice1:"Эта заявка может использоваться в образовательных/тестовых целях. Указывайте только запрошенные данные. Не вводите пароли, коды подтверждения, коды восстановления или банковские данные. Информация и документы будут отправлены администратору через Telegram для проверки.", notice2:"Мы не утверждаем, что эта веб-форма скрытно читает адрес/местоположение телефона, SIM или Gmail. Любая реальная проверка будет явно описана.", name:"Имя", number1:"Номер 1", number2:"Номер 2", age:"Возраст", gmail1:"Gmail 1", gmail2:"Gmail 2", accept:"Я прочитал(а) правила и уведомление о конфиденциальности и принимаю их.", documents:"Документы", fileHelp:"PDF, JPG, PNG, WEBP · до 10 МБ каждый · 8 файлов", remove:"Удалить", continue:"К просмотру", edit:"Изменить", confirm:"Подтвердить и отправить", sending:"Отправка…", rules:"Правила", accepted:"Принято", notAccepted:"Не принято", noDocs:"Документы не прикреплены.", privacy:"Отправляйте только те данные, которыми готовы поделиться. Никогда не отправляйте пароли или одноразовые коды.", submitted:"Успешно отправлено.", submitFailed:"Не удалось отправить.", invalidG1:"Введите корректный Gmail 1.", invalidG2:"Введите корректный Gmail 2.", required:"Заполните все обязательные поля.", rulesErr:"Необходимо принять правила.", sizeErr:"Общий размер загрузки не должен превышать 40 МБ.", typeErr:"Неподдерживаемый тип файла:", largeErr:"Файл больше 10 МБ:" },
  zh: { lang:"语言", application:"申请", preview:"预览", title:"提交您的信息", previewTitle:"检查申请", subtitle:"填写表格并在提交前检查信息。", previewSub:"发送前请检查信息。", important:"重要信息", notice1:"此申请可能用于教育/测试目的。请只填写以下要求的信息。不要输入密码、验证码、恢复码或银行信息。您提交的信息和文件将通过 Telegram 发送给管理员审核。", notice2:"我们不会声称此网页表单会秘密读取您的手机地址/位置、SIM 或 Gmail 账户。任何实际验证都会明确说明。", name:"姓名", number1:"号码 1", number2:"号码 2", age:"年龄", gmail1:"Gmail 1", gmail2:"Gmail 2", accept:"我已阅读并同意申请规则和隐私声明。", documents:"文件", fileHelp:"PDF、JPG、PNG、WEBP · 每个最多 10 MB · 8 个文件", remove:"删除", continue:"继续预览", edit:"编辑", confirm:"确认并提交", sending:"正在发送…", rules:"规则", accepted:"已接受", notAccepted:"未接受", noDocs:"未附加文件。", privacy:"只提交您愿意为该目的分享的信息。请勿提交密码或一次性验证码。", submitted:"提交成功。", submitFailed:"提交失败。", invalidG1:"请输入有效的 Gmail 1。", invalidG2:"请输入有效的 Gmail 2。", required:"请填写所有必填字段。", rulesErr:"必须接受规则。", sizeErr:"所有上传文件总大小不得超过 40 MB。", typeErr:"不支持的文件类型：", largeErr:"文件超过 10 MB：" },
  ar: { lang:"اللغة", application:"طلب", preview:"معاينة", title:"أرسل معلوماتك", previewTitle:"راجع طلبك", subtitle:"أكمل النموذج وراجع المعلومات قبل الإرسال.", previewSub:"تحقق من المعلومات قبل الإرسال.", important:"معلومات مهمة", notice1:"قد يُستخدم هذا الطلب لأغراض تعليمية/اختبارية. أرسل المعلومات المطلوبة فقط. لا تدخل كلمات المرور أو رموز التحقق أو رموز الاسترداد أو المعلومات البنكية. سيتم إرسال معلوماتك ومستنداتك إلى المسؤول عبر Telegram للمراجعة.", notice2:"لا ندعي أن نموذج الويب هذا يقرأ سراً عنوان/موقع هاتفك أو SIM أو حساب Gmail. سيتم توضيح أي تحقق فعلي بشكل صريح.", name:"الاسم", number1:"الرقم 1", number2:"الرقم 2", age:"العمر", gmail1:"Gmail 1", gmail2:"Gmail 2", accept:"لقد قرأت قواعد الطلب وإشعار الخصوصية وأوافق عليهما.", documents:"المستندات", fileHelp:"PDF، JPG، PNG، WEBP · حتى 10 MB لكل ملف · 8 ملفات", remove:"حذف", continue:"متابعة إلى المعاينة", edit:"تعديل", confirm:"تأكيد وإرسال", sending:"جارٍ الإرسال…", rules:"القواعد", accepted:"مقبول", notAccepted:"غير مقبول", noDocs:"لا توجد مستندات مرفقة.", privacy:"أرسل فقط المعلومات التي تشعر بالراحة عند مشاركتها للغرض المذكور. لا ترسل كلمات المرور أو الرموز لمرة واحدة.", submitted:"تم الإرسال بنجاح.", submitFailed:"فشل الإرسال.", invalidG1:"أدخل عنوان Gmail 1 صحيحاً.", invalidG2:"أدخل عنوان Gmail 2 صحيحاً.", required:"أكمل جميع الحقول المطلوبة.", rulesErr:"يجب قبول القواعد.", sizeErr:"يجب ألا يتجاوز إجمالي الرفع 40 MB.", typeErr:"نوع ملف غير مدعوم:", largeErr:"الملف أكبر من 10 MB:" },
} as const;

const LANGS: { code: Lang; label: string }[] = [
  { code: "bn", label: "বাংলা" }, { code: "en", label: "English" }, { code: "hi", label: "हिन्दी" },
  { code: "ur", label: "اردو" }, { code: "ru", label: "Русский" }, { code: "zh", label: "中文" }, { code: "ar", label: "العربية" },
];

export default function Home() {
  const [lang, setLang] = useState<Lang>("bn");
  const t = T[lang];
  const rtl = lang === "ur" || lang === "ar";
  const [form, setForm] = useState<FormData>({ name: "", number1: "", number2: "", age: "", gmail1: "", gmail2: "", accepted: false });
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [honeypot, setHoneypot] = useState("");

  function update(key: keyof FormData, value: string | boolean) { setForm((x) => ({ ...x, [key]: value })); }
  function validate() {
    if (!form.name.trim() || !form.number1.trim() || !form.number2.trim() || !form.gmail1.trim() || !form.gmail2.trim()) return t.required;
    if (!form.gmail1.toLowerCase().includes("@gmail.com")) return t.invalidG1;
    if (!form.gmail2.toLowerCase().includes("@gmail.com")) return t.invalidG2;
    if (!form.accepted) return t.rulesErr;
    return "";
  }
  async function submit() {
    const error = validate(); if (error) { setResult(error); return; }
    setLoading(true); setResult("");
    const body = new FormData();
    body.append("name", form.name); body.append("number1", form.number1); body.append("number2", form.number2); body.append("age", form.age);
    body.append("gmail1", form.gmail1); body.append("gmail2", form.gmail2); body.append("accepted", String(form.accepted)); body.append("website", honeypot);
    try {
      const response = await fetch("/api/submit", { method: "POST", body });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || t.submitFailed);
      setResult(t.submitted); setForm({ name: "", number1: "", number2: "", age: "", gmail1: "", gmail2: "", accepted: false }); setPreview(false);
    } catch (e) { setResult(e instanceof Error ? e.message : t.submitFailed); }
    finally { setLoading(false); }
  }

  const languageSelector = (
    <div className="languageBar">
      <span>{t.lang}</span>
      <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} aria-label={t.lang}>
        {LANGS.map((x) => <option key={x.code} value={x.code}>{x.label}</option>)}
      </select>
    </div>
  );

  if (preview) return (
    <main className="shell" dir={rtl ? "rtl" : "ltr"} lang={lang}>
      <section className="card">
        {languageSelector}<div className="eyebrow">{t.preview}</div><h1>{t.previewTitle}</h1><p className="muted">{t.previewSub}</p>
        <div className="preview">
          <Row label={t.name} value={form.name}/><Row label={t.number1} value={form.number1}/><Row label={t.number2} value={form.number2}/><Row label={t.age} value={form.age || "—"}/><Row label={t.gmail1} value={form.gmail1}/><Row label={t.gmail2} value={form.gmail2}/><Row label={t.rules} value={form.accepted ? t.accepted : t.notAccepted}/>
        </div>
        <div className="actions"><button className="secondary" onClick={()=>setPreview(false)} disabled={loading}>{t.edit}</button><button className="primary" onClick={submit} disabled={loading}>{loading?t.sending:t.confirm}</button></div>
        {result && <div className="status">{result}</div>}
      </section>
    </main>
  );

  return (
    <main className="shell" dir={rtl ? "rtl" : "ltr"} lang={lang}>
      <section className="card">
        {languageSelector}<div className="eyebrow">{t.application}</div><h1>{t.title}</h1><p className="muted">{t.subtitle}</p>
        <div className="notice"><b>{t.important}</b><p>{t.notice1}</p><p>{t.notice2}</p></div>
        <div className="grid">
          <label>{t.name} *<input value={form.name} onChange={e=>update("name",e.target.value)}/></label>
          <label>{t.number1} *<input inputMode="tel" value={form.number1} onChange={e=>update("number1",e.target.value)}/></label>
          <label>{t.number2} *<input inputMode="tel" value={form.number2} onChange={e=>update("number2",e.target.value)}/></label>
          <label>{t.age}<input inputMode="numeric" value={form.age} onChange={e=>update("age",e.target.value)}/></label>
          <label>{t.gmail1} *<input type="email" value={form.gmail1} onChange={e=>update("gmail1",e.target.value)}/></label>
          <label>{t.gmail2} *<input type="email" value={form.gmail2} onChange={e=>update("gmail2",e.target.value)}/></label>
        </div>
        <label className="checkbox"><input type="checkbox" checked={form.accepted} onChange={e=>update("accepted",e.target.checked)}/><span>{t.accept}</span></label>
        <div className="honeypot" aria-hidden="true"><label>Website<input value={honeypot} onChange={e=>setHoneypot(e.target.value)} tabIndex={-1}/></label></div>
        <button className="primary wide" onClick={()=>{const error=validate();if(error)setResult(error);else setPreview(true);}}>{t.continue}</button>
        {result && <div className="status">{result}</div>}<p className="privacy">{t.privacy}</p>
      </section>
    </main>
  );
}

function Row({label,value}:{label:string;value:string}) { return <div className="row"><b>{label}</b><span>{value}</span></div>; }
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
