import { useState, useEffect, useRef } from "react";
import {
  ChevronDown, ArrowRight, MapPin, Calendar, RotateCcw,
  Send, Clock, X, Check, CreditCard, ChevronLeft, Lock
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

type Dinner = {
  id: number;
  title: string;
  age: string;
  format: string;
  date: string;
  time: string;
  area: string;
  restaurant: string;
  price: string;
  priceNum: number;
  spotsM: number;
  spotsF: number;
  emoji: string;
  tag: string;
  description: string;
  criteria: string;
  question: string;
};

const dinners: Dinner[] = [
  {
    id: 1, title: "Бегуны", age: "25–30", format: "бранч", date: "2 августа, сб", time: "12:00",
    area: "Центр · Москва", restaurant: "Björn", price: "1 600 ₽", priceNum: 1600,
    spotsM: 2, spotsF: 1, emoji: "🏃", tag: "Спорт",
    description: "Стол для тех, кто регулярно бегает — на тренировках, на соревнованиях или просто по утрам. Не важно, марафонец ты или паркраневец. Важно, что бег — часть твоей недели.",
    criteria: "Возраст 25–30 лет. Бег как регулярная практика — хотя бы раз в неделю. Читаем анкету вручную.",
    question: "Как давно ты бегаешь и где обычно тренируешься? Есть любимые маршруты или забеги?",
  },
  {
    id: 2, title: "Бегуны", age: "30–35", format: "ужин", date: "9 августа, сб", time: "19:30",
    area: "Центр · Москва", restaurant: "Selfie", price: "1 600 ₽", priceNum: 1600,
    spotsM: 0, spotsF: 2, emoji: "🏃", tag: "Спорт",
    description: "То же самое, но чуть старше — и, возможно, чуть медленнее на первых километрах. Стол для тех, кто пробежал достаточно, чтобы сравнивать кроссовки и маршруты.",
    criteria: "Возраст 30–35 лет. Бег как регулярная практика. Паркраны, полумарафоны, любые забеги приветствуются.",
    question: "Как давно бегаешь? Есть ли дистанция, к которой сейчас готовишься?",
  },
  {
    id: 3, title: "Йога", age: "25–30", format: "бранч", date: "16 августа, сб", time: "13:00",
    area: "Центр · Москва", restaurant: "Uilliam's", price: "1 600 ₽", priceNum: 1600,
    spotsM: 1, spotsF: 2, emoji: "🧘", tag: "Велнес",
    description: "Для тех, кто практикует йогу — в студии, дома или на ретритах. Не важно, флоу ты или аштанга. Важно, что это часть жизни, а не разовый эксперимент.",
    criteria: "Возраст 25–30 лет. Регулярная практика йоги — хотя бы 1–2 раза в неделю. Направление не имеет значения.",
    question: "Как давно практикуешь йогу? В какой студии или каком направлении? Что привело тебя к этому?",
  },
  {
    id: 4, title: "Йога", age: "30–35", format: "ужин", date: "23 августа, сб", time: "19:00",
    area: "Центр · Москва", restaurant: "Ugolek", price: "1 600 ₽", priceNum: 1600,
    spotsM: 2, spotsF: 3, emoji: "🧘", tag: "Велнес",
    description: "Стол для практикующих йогу 30–35 лет. Скорее всего, ты уже понимаешь, зачем тебе это — и интересно поговорить с людьми, у которых та же история.",
    criteria: "Возраст 30–35 лет. Регулярная практика — студия, домашняя, ретриты. Читаем каждую анкету.",
    question: "Сколько лет практикуешь йогу? Что для тебя в ней главное — физическое, ментальное, духовное?",
  },
  {
    id: 5, title: "Digital Nomads", age: "27–35", format: "ужин", date: "30 августа, сб", time: "19:30",
    area: "Центр · Москва", restaurant: "354 Exclusive", price: "1 600 ₽", priceNum: 1600,
    spotsM: 1, spotsF: 0, emoji: "✂️", tag: "Путешествия",
    description: "Стол вокруг аудитории сообщества «Смена» и смежных комьюнити — люди, которые живут как перелетные птицы и хотели бы перелелать вместе.",
    criteria: "Возраст 27–35 лет. Диджитал Номады.",
    question: "Откуда ты про нас узнал и как связан со «Сменой» или пространством вокруг неё?",
  },
  {
    id: 6, title: "Предприниматели", age: "27–35", format: "ужин", date: "6 сентября, сб", time: "19:30",
    area: "Центр · Москва", restaurant: "Китайская грамота", price: "1 600 ₽", priceNum: 1600,
    spotsM: 2, spotsF: 1, emoji: "🎨", tag: "Бизнес",
    description: "Стол для предпринимателей и предпринимательниц, зовем участников коммьюнити Хегай, Реформа, Атланты",
    criteria: "Возраст 27–35 лет. Причастность к арт-сцене — работа, практика или активный интерес. Анкету читаем внимательно.",
    question: "Как ты связан с бизнесом? Чем занимаешься — что создаёшь и продаёшь?",
  },
  {
    id: 7, title: "Предприниматели", age: "35–42", format: "ужин", date: "6 сентября, сб", time: "19:30",
    area: "Центр · Москва", restaurant: "Китайская грамота", price: "1 600 ₽", priceNum: 1600,
    spotsM: 2, spotsF: 1, emoji: "🎨", tag: "Бизнес",
    description: "Стол для предпринимателей и предпринимательниц, зовем участников коммьюнити Хегай, Реформа, Атланты",
    criteria: "Возраст 35–42 года. Причастность к арт-сцене — работа, практика или активный интерес. Анкету читаем внимательно.",
    question: "Как ты связан с бизнесом? Чем занимаешься — что создаёшь и продаёшь?",
  },
  {
    id: 8, title: "Состоятельные", age: "25–30", format: "ужин", date: "13 сентября, сб", time: "20:00",
    area: "Центр · Москва", restaurant: "White Rabbit", price: "16 000 ₽", priceNum: 16000,
    spotsM: 1, spotsF: 1, emoji: "🍷", tag: "Премиум",
    description: "Давайте честно, чаще всего люди образуют пары с человеком из своего социального слоя, потому что эти люди могут друг друга понять, а их образ жизни схож и совместим. Эта встреча имеет заградительную цену и предназначена для тех, кто легко может потратить 16 000 на небольшой социальный эксперимент. Отбор строже — анкета и разговор с организатором.",
    criteria: "Возраст 25–30 лет. Old Money, New Money — не важно. Не берем тех, кто ищет спонсора. Проводим короткий звонок перед подтверждением.",
    question: "Чем занимаешься, что тебя интересует? Почему решил подать заявку именно на этот стол?",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useBodyLock(active: boolean) {
  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [active]);
}

// ─── Dinner Card ──────────────────────────────────────────────────────────────

function DinnerCard({ dinner, onOpen }: { dinner: Dinner; onOpen: () => void }) {
  const weekday = dinner.date.split(", ")[1] ?? "";
  return (
    <div
      onClick={onOpen}
      className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase font-sans">{dinner.tag}</span>
          <h3 className="text-xl font-display font-semibold text-foreground mt-0.5 leading-tight" style={{ fontFamily: "'Lora', serif" }}>
            {dinner.emoji} {dinner.title} {dinner.age} лет
          </h3>
        </div>
        <span className="text-lg font-semibold text-primary whitespace-nowrap" style={{ fontFamily: "'Lora', serif" }}>{dinner.price}</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
          <Clock className="w-4 h-4 shrink-0" />{dinner.format}, {weekday} {dinner.time}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
          <Calendar className="w-4 h-4 shrink-0" />{dinner.date}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
          <MapPin className="w-4 h-4 shrink-0" />{dinner.area} · {dinner.restaurant}
        </div>
      </div>
      <div className="mt-auto pt-2 border-t border-border">
        <button
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          className="w-full py-2.5 rounded-xl text-sm font-sans font-medium bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
        >
          Подробнее <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({ step }: { step: number }) {
  const steps = ["Данные", "О себе", "Согласие"];
  return (
    <div className="flex items-center gap-0">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-sans font-medium transition-all duration-300 ${done ? "bg-primary text-primary-foreground" : active ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"}`}>
                {done ? <Check className="w-4 h-4" /> : idx}
              </div>
              <span className={`text-xs font-sans whitespace-nowrap ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px w-10 sm:w-16 mx-1 mb-5 transition-all duration-300 ${done ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

type ModalScreen = "detail" | "form" | "payment" | "confirm";

function DinnerModal({ dinner, onClose }: { dinner: Dinner; onClose: () => void }) {
  useBodyLock(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [screen, setScreen] = useState<ModalScreen>("detail");
  const [formStep, setFormStep] = useState(1);
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [form, setForm] = useState({ name: "", age: "", telegram: "", experience: "" });
  const [agree, setAgree] = useState({ refund: false, friendly: false, split: false });
  const [waitlist, setWaitlist] = useState(false);

  const mFull = dinner.spotsM >= 3;
  const fFull = dinner.spotsF >= 3;
  const confirmDate = (() => {
    const parts = dinner.date.split(", ")[0].split(" ");
    const months: Record<string, string> = { "января": "01", "февраля": "02", "марта": "03", "апреля": "04", "мая": "05", "июня": "06", "июля": "07", "августа": "08", "сентября": "09", "октября": "10", "ноября": "11", "декабря": "12" };
    const d = parseInt(parts[0]) - 5;
    return `${d} ${parts[1]}`;
  })();

  const allAgreed = agree.refund && agree.friendly && agree.split;

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const canRegister = gender === "male" ? !mFull : gender === "female" ? !fFull : true;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
    >
      <div className="bg-background w-full sm:max-w-xl max-h-[96dvh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            {(screen === "form" || screen === "payment") && (
              <button
                onClick={() => screen === "payment" ? setScreen("form") : screen === "form" && formStep > 1 ? setFormStep(formStep - 1) : setScreen("detail")}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <p className="text-xs text-muted-foreground font-sans">{dinner.tag}</p>
              <h2 className="font-semibold text-foreground text-base leading-tight" style={{ fontFamily: "'Lora', serif" }}>
                {dinner.emoji} {dinner.title} {dinner.age}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">

          {/* ── DETAIL ── */}
          {screen === "detail" && (
            <div className="px-6 py-6 flex flex-col gap-6">
              {/* Meta */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
                  <Calendar className="w-4 h-4 shrink-0" />
                  {dinner.date} · {dinner.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {dinner.restaurant}, {dinner.area}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-sans font-semibold text-foreground mb-2">Кто за этим столом</h3>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed">{dinner.description}</p>
              </div>

              {/* Criteria */}
              <div className="bg-secondary rounded-2xl p-4">
                <p className="text-xs font-sans font-semibold text-primary uppercase tracking-widest mb-2">Критерии отбора</p>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed">{dinner.criteria}</p>
              </div>

              {/* How it goes */}
              <div className="border border-border rounded-2xl p-5 flex flex-col gap-3">
                <h3 className="font-sans font-semibold text-foreground">Как проходит встреча</h3>
                <ul className="flex flex-col gap-2">
                  {[
                    "Все участники — синглы, но вечер дружеский, не романтический",
                    "Без давления: это знакомство, не свидание",
                    "Каждый платит за себя (сплит по счёту)",
                    "~2–2.5 часа за одним столом",
                    "Место: ресторан, выбран организатором",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-muted-foreground font-sans">
                      <span className="text-primary mt-0.5 shrink-0">·</span>{item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Guarantee */}
              <div className="flex items-start gap-3 bg-primary/5 border border-primary/15 rounded-2xl p-4">
                <RotateCcw className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                  <span className="text-foreground font-medium">Гарантия возврата:</span> если за 2 дня до встречи стол не наберётся — возвращаем полную сумму.
                </p>
              </div>

              {/* Price line */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground font-sans">Стоимость бронирования</span>
                <span className="text-xl font-semibold text-foreground" style={{ fontFamily: "'Lora', serif" }}>{dinner.price}</span>
              </div>
            </div>
          )}

          {/* ── FORM ── */}
          {screen === "form" && (
            <div className="px-6 py-6 flex flex-col gap-6">
              <div className="flex justify-center">
                <Stepper step={formStep} />
              </div>

              {formStep === 1 && (
                <div className="flex flex-col gap-4">
                  <h3 className="font-semibold text-foreground" style={{ fontFamily: "'Lora', serif" }}>Расскажи о себе</h3>
                  <Field label="Имя">
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Как тебя зовут" className={inputCls} />
                  </Field>
                  <Field label="Возраст">
                    <input value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="Полных лет" type="number" min={18} max={60} className={inputCls} />
                  </Field>
                  <Field label="Пол">
                    <div className="flex gap-3">
                      {(["male", "female"] as const).map((g) => (
                        <button
                          key={g}
                          onClick={() => setGender(g)}
                          className={`flex-1 py-2.5 rounded-xl border text-sm font-sans font-medium transition-all duration-200 ${gender === g ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
                        >
                          {g === "male" ? "👨 Мужской" : "👩 Женский"}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Telegram">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-sans text-sm">@</span>
                      <input value={form.telegram} onChange={e => setForm({ ...form, telegram: e.target.value })} placeholder="username" className={inputCls + " pl-8"} />
                    </div>
                  </Field>
                </div>
              )}

              {formStep === 2 && (
                <div className="flex flex-col gap-4">
                  <h3 className="font-semibold text-foreground" style={{ fontFamily: "'Lora', serif" }}>Немного о твоём опыте</h3>
                  <p className="text-sm text-muted-foreground font-sans leading-relaxed bg-secondary rounded-xl p-4">
                    {dinner.question}
                  </p>
                  <Field label="Твой ответ">
                    <textarea
                      value={form.experience}
                      onChange={e => setForm({ ...form, experience: e.target.value })}
                      placeholder="Пиши свободно, 2–4 предложения"
                      rows={5}
                      className={inputCls + " resize-none"}
                    />
                  </Field>
                  <p className="text-xs text-muted-foreground font-sans">Анкету читаем вручную — напиши честно.</p>
                </div>
              )}

              {formStep === 3 && (
                <div className="flex flex-col gap-4">
                  <h3 className="font-semibold text-foreground" style={{ fontFamily: "'Lora', serif" }}>Прочитай и подтверди</h3>
                  {[
                    { key: "refund" as const, text: "Понимаю, что если стол не наберётся за 2 дня до встречи, оплата будет возвращена в полном объёме." },
                    { key: "friendly" as const, text: "Понимаю, что это дружеский ужин, а не свидание вслепую. Без романтических ожиданий и давления." },
                    { key: "split" as const, text: "Готов(а) платить за себя по счёту (сплит). Стоимость ужина в ресторане оплачивается отдельно." },
                  ].map(({ key, text }) => (
                    <label key={key} className="flex gap-3 cursor-pointer">
                      <button
                        onClick={() => setAgree({ ...agree, [key]: !agree[key] })}
                        className={`w-5 h-5 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200 ${agree[key] ? "bg-primary border-primary" : "border-border"}`}
                      >
                        {agree[key] && <Check className="w-3 h-3 text-primary-foreground" />}
                      </button>
                      <span className="text-sm text-muted-foreground font-sans leading-relaxed">{text}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PAYMENT ── */}
          {screen === "payment" && (
            <div className="px-6 py-6 flex flex-col gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">💳</div>
                <h3 className="font-semibold text-foreground text-xl mb-1" style={{ fontFamily: "'Lora', serif" }}>Оплата брони</h3>
                <p className="text-sm text-muted-foreground font-sans">Стол будет зарезервирован сразу после оплаты</p>
              </div>

              <div className="bg-secondary rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-muted-foreground">Ужин «{dinner.title} {dinner.age}»</span>
                  <span className="font-medium text-foreground">{dinner.price}</span>
                </div>
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-muted-foreground">{dinner.date} · {dinner.time}</span>
                  <span className="text-muted-foreground">{dinner.restaurant}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-sans">
                  <span className="font-medium text-foreground">Итого</span>
                  <span className="font-semibold text-foreground text-lg" style={{ fontFamily: "'Lora', serif" }}>{dinner.price}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Field label="Номер карты">
                  <input placeholder="0000 0000 0000 0000" className={inputCls} maxLength={19} />
                </Field>
                <div className="flex gap-3">
                  <Field label="Срок действия" className="flex-1">
                    <input placeholder="MM/YY" className={inputCls} maxLength={5} />
                  </Field>
                  <Field label="CVV" className="flex-1">
                    <input placeholder="···" className={inputCls} maxLength={3} type="password" />
                  </Field>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                Платёж защищён. Данные карты не хранятся.
              </div>
            </div>
          )}

          {/* ── CONFIRM ── */}
          {screen === "confirm" && (
            <div className="px-6 py-8 flex flex-col gap-6 text-center">
              <div>
                <div className="text-5xl mb-4">{waitlist ? "🕐" : "🎉"}</div>
                {waitlist ? (
                  <>
                    <h3 className="font-semibold text-foreground text-2xl mb-2" style={{ fontFamily: "'Lora', serif" }}>Вы в листе ожидания</h3>
                    <p className="text-muted-foreground font-sans text-sm leading-relaxed max-w-xs mx-auto">Если освободится место — напишем в Telegram первым.</p>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-foreground text-2xl mb-2" style={{ fontFamily: "'Lora', serif" }}>Вы записаны!</h3>
                    <p className="text-sm text-muted-foreground font-sans">Место забронировано</p>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-3 text-left">
                <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-2.5">
                  <InfoRow icon="📅" label="Ужин состоится" value={`${dinner.date} · ${dinner.time}`} />
                  <InfoRow icon="📍" label="Место" value={`${dinner.restaurant}, ${dinner.area}`} />
                  <InfoRow icon="✅" label="Подтверждение" value={`До ${confirmDate} в Telegram`} />
                  <InfoRow icon="💬" label="Канал уведомлений" value="@zastolom_bot" />
                </div>

                <div className="flex items-start gap-3 bg-primary/5 border border-primary/15 rounded-2xl p-4">
                  <RotateCcw className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                    Если за 2 дня до встречи стол не наберётся — вернём {dinner.price} в течение 3 рабочих дней.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {screen !== "confirm" && (
          <div className="px-6 py-4 border-t border-border shrink-0 bg-background">
            {screen === "detail" && (
              <button
                onClick={() => {
                  if (mFull && fFull) { setWaitlist(true); setScreen("confirm"); }
                  else setScreen("form");
                }}
                className="w-full py-3.5 rounded-xl font-sans font-medium text-sm bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                {mFull && fFull ? (
                  <><Clock className="w-4 h-4" /> В лист ожидания</>
                ) : (
                  <><CreditCard className="w-4 h-4" /> Записаться · {dinner.price}</>
                )}
              </button>
            )}

            {screen === "form" && formStep < 3 && (
              <button
                disabled={
                  formStep === 1 ? (!form.name || !form.age || !gender || !form.telegram) :
                  formStep === 2 ? !form.experience.trim() : false
                }
                onClick={() => setFormStep(formStep + 1)}
                className="w-full py-3.5 rounded-xl font-sans font-medium text-sm bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Далее <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {screen === "form" && formStep === 3 && (
              <button
                disabled={!allAgreed}
                onClick={() => setScreen("payment")}
                className="w-full py-3.5 rounded-xl font-sans font-medium text-sm bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" /> Перейти к оплате
              </button>
            )}

            {screen === "payment" && (
              <button
                onClick={() => setScreen("confirm")}
                className="w-full py-3.5 rounded-xl font-sans font-medium text-sm bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" /> Оплатить {dinner.price}
              </button>
            )}
          </div>
        )}

        {screen === "confirm" && (
          <div className="px-6 py-4 border-t border-border shrink-0 bg-background">
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl font-sans font-medium text-sm bg-secondary text-secondary-foreground hover:opacity-80 active:scale-[0.98] transition-all duration-200"
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

const inputCls = "w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-sans font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-base shrink-0">{icon}</span>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground font-sans">{label}</span>
        <span className="text-sm font-sans font-medium text-foreground">{value}</span>
      </div>
    </div>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const faqItems = [
  { q: "Как проверяются участники?", a: "Каждый заполняет анкету — мы читаем её вручную. Анонимных записей нет: имя, возраст и ссылка на Telegram обязательны." },
  { q: "Это безопасно?", a: "Ужин проходит в публичном ресторане. Имена всех участников известны организатору до ужина. Если что-то идёт не так — напишите нам." },
  { q: "Когда вернут деньги?", a: "Если за 2 дня до встречи не набирается 6 человек, стол отменяется и мы возвращаем полную сумму в течение 3 рабочих дней." },
  { q: "Можно прийти с другом?", a: "Да, можно." },
  { q: "Это сайт знакомств?", a: "Нет. Цель — хороший вечер с интересными людьми. Может, появятся друзья или что-то большее — но мы не обещаем и не устраиваем пары." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left gap-4">
        <span className="font-sans font-medium text-foreground text-base">{q}</span>
        <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-48 pb-5" : "max-h-0"}`}>
        <p className="text-muted-foreground font-sans text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeModal, setActiveModal] = useState<Dinner | null>(null);
  const [waitlistForm, setWaitlistForm] = useState({ name: "", age: "", contact: "", request: "" });
  const [waitlistSent, setWaitlistSent] = useState(false);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {activeModal && <DinnerModal dinner={activeModal} onClose={() => setActiveModal(null)} />}

      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <span className="font-semibold text-foreground leading-tight" style={{ fontFamily: "'Lora', serif", fontSize: "18px" }}>
            Порция знакомств
          </span>
          <button onClick={() => scrollTo("dinners")} className="text-sm font-medium text-primary hover:opacity-80 transition-opacity">
            Смотреть ужины
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-5 pt-20 pb-24 text-center">
        <p className="text-sm font-medium text-primary tracking-widest uppercase font-sans mb-6">Москва · 2026</p>
        <h1 className="text-5xl md:text-7xl font-semibold text-foreground leading-tight mb-6" style={{ fontFamily: "'Lora', serif" }}>
          Бранчи и ужины <em className="text-primary font-medium">для тех, кто ищет своего человека</em>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed mb-10">
          Стол на троих мужчин и трёх женщин — объединённых не алгоритмом, а общим образом жизни. И просто хороший вечер.
        </p>
        <button
          onClick={() => scrollTo("dinners")}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-sans font-medium text-base hover:opacity-90 active:scale-[0.98] transition-all duration-200"
        >
          Смотреть ужины <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-secondary">
        <div className="max-w-5xl mx-auto px-5 py-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-14" style={{ fontFamily: "'Lora', serif" }}>Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { n: "01", title: "Выбери стол", desc: "Находишь ужин, который подходит по возрасту и интересу." },
              { n: "02", title: "Анкета", desc: "Коротко о себе — имя, возраст, соцсети. Мы напишем тебе в Telegram." },
              { n: "03", title: "Оплата", desc: "Бронируешь место. Деньги вернём, если стол не наберётся." },
              { n: "04", title: "Приходи", desc: "В назначенный день — в ресторан. Без подготовки." },
            ].map((step) => (
              <div key={step.n} className="flex flex-col gap-3">
                <span className="text-4xl font-semibold text-primary/30" style={{ fontFamily: "'Lora', serif" }}>{step.n}</span>
                <h3 className="font-sans font-semibold text-foreground text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground font-sans mt-12 flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Если за 2 дня до встречи не набирается 6 человек — полный возврат
          </p>
        </div>
      </section>

      {/* DINNERS */}
      <section id="dinners" className="max-w-5xl mx-auto px-5 py-20">
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-4" style={{ fontFamily: "'Lora', serif" }}>Открытые столы</h2>
        <p className="text-center text-muted-foreground font-sans mb-12">7 ужинов этим летом и осенью</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {dinners.map((d) => (
            <DinnerCard key={d.id} dinner={d} onOpen={() => setActiveModal(d)} />
          ))}
        </div>
      </section>

      {/* HOW THE MEETING GOES */}
      <section className="bg-secondary">
        <div className="max-w-5xl mx-auto px-5 py-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-4" style={{ fontFamily: "'Lora', serif" }}>Как проходит встреча</h2>
          <p className="text-center text-muted-foreground font-sans mb-14 max-w-xl mx-auto">Простой формат без лишнего давления — только стол, разговор и шестеро людей с общим контекстом.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: "🙋", title: "Приходишь один", desc: "Без компании и знакомых — так динамика за столом честнее." },
              { emoji: "🍽️", title: "Общий стол на шестерых", desc: "Трое мужчин и три женщины, объединённые общим образом жизни." },
              { emoji: "💬", title: "~2–2.5 часа разговора", desc: "Достаточно, чтобы понять, есть ли химия — без спешки и неловкости." },
              { emoji: "💳", title: "Каждый платит за себя", desc: "Счёт в ресторане делится поровну — сплит без сложностей." },
              { emoji: "🎯", title: "Без ожиданий", desc: "Это не свидание вслепую. Может получиться дружба, может — больше." },
              { emoji: "📍", title: "Место выбираем мы", desc: "Уютный ресторан в центре Москвы — детали пришлём заранее." },
            ].map((item, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border border-border">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-semibold text-foreground text-lg mb-2" style={{ fontFamily: "'Lora', serif" }}>{item.title}</h3>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-5xl mx-auto px-5 py-20">
        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-10 md:p-14 text-center">
          <div className="text-5xl mb-6">🥂</div>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4" style={{ fontFamily: "'Lora', serif" }}>О проекте</h2>
          <p className="text-muted-foreground font-sans max-w-xl mx-auto leading-relaxed">
            «Порция знакомств» — это бранчи и ужины для тех, кому надоели бесконечные свайпы и рандомные нетворкинги. Мы собираем небольшие столы из людей с общим образом жизни или интересами — бегунов с бегунами, йогов с йогами — и оставляем им пространство для живого разговора. Никаких анкет-роботов и оценок: каждую заявку читает человек, а каждая встреча — это просто хороший вечер, без гарантий и обязательств.
          </p>
        </div>
      </section>

      {/* CREATORS */}
      <section className="max-w-5xl mx-auto px-5 py-20">
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-3" style={{ fontFamily: "'Lora', serif" }}>
          Кто за этим стоит
        </h2>
        <p className="text-center text-muted-foreground font-sans mb-12 max-w-lg mx-auto">
          Проект придумали двое — не стартаперы, а люди, которым самим надоело ходить на рандомные мероприятия.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Юлия */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="h-64 bg-muted overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/15 to-secondary">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-3xl font-semibold text-primary" style={{ fontFamily: "'Lora', serif" }}>Ю</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-1" style={{ fontFamily: "'Lora', serif" }}>
                Юлия Серебрийская
              </h3>
              <p className="text-xs font-sans font-medium text-primary uppercase tracking-widest mb-3">Сооснователь</p>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                Психолог и фасилитатор. Последние три года изучает, как люди заводят настоящие связи во взрослом возрасте. Придумала формат стола после того, как сама сходила на десяток «нетворкингов» и ни разу не нашла там близких по духу людей.
              </p>
            </div>
          </div>

          {/* Егор */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="h-64 bg-muted overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/15 to-secondary">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-3xl font-semibold text-primary" style={{ fontFamily: "'Lora', serif" }}>Е</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-1" style={{ fontFamily: "'Lora', serif" }}>
                Егор Дранев
              </h3>
              <p className="text-xs font-sans font-medium text-primary uppercase tracking-widest mb-3">Сооснователь</p>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                Продакт и сооснователь нескольких проектов в медиа и еде. Верит, что лучшие разговоры случаются за столом — и что к этому можно подготовиться лучше, чем просто собрать незнакомых людей в одной комнате.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section className="bg-secondary">
        <div className="max-w-5xl mx-auto px-5 py-20">
          <div className="max-w-xl mx-auto text-center">
            <Clock className="w-8 h-8 text-primary mx-auto mb-5" />
            <h2 className="text-3xl font-semibold text-foreground mb-3" style={{ fontFamily: "'Lora', serif" }}>Не нашёл свой стол?</h2>
            <p className="text-muted-foreground font-sans mb-8 leading-relaxed">Расскажи, какой стол ты бы хотел видеть — оставь контакт, и мы напишем, когда появится подходящий.</p>
            {waitlistSent ? (
              <div className="py-8"><div className="text-4xl mb-4">👋</div>
                <p className="font-sans font-medium text-foreground">Получили, спасибо!</p>
                <p className="text-muted-foreground font-sans text-sm mt-1">Напишем как только появится подходящий стол.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setWaitlistSent(true); }} className="flex flex-col gap-4 text-left">
                <Field label="Имя">
                  <input value={waitlistForm.name} onChange={e => setWaitlistForm({ ...waitlistForm, name: e.target.value })} placeholder="Как тебя зовут" required className={inputCls} />
                </Field>
                <Field label="Возраст">
                  <input value={waitlistForm.age} onChange={e => setWaitlistForm({ ...waitlistForm, age: e.target.value })} placeholder="Твой возраст" required className={inputCls} />
                </Field>
                <Field label="Контакт">
                  <input value={waitlistForm.contact} onChange={e => setWaitlistForm({ ...waitlistForm, contact: e.target.value })} placeholder="Telegram или email" required className={inputCls} />
                </Field>
                <Field label="Какой стол ты бы хотел видеть?">
                  <textarea value={waitlistForm.request} onChange={e => setWaitlistForm({ ...waitlistForm, request: e.target.value })} placeholder="Например: настольные игры 28–35, велосипедисты, книжный клуб..." rows={3} className={inputCls + " resize-none"} />
                </Field>
                <button type="submit" className="mt-2 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-sans font-medium hover:opacity-90 active:scale-[0.98] transition-all duration-200">
                  <Send className="w-4 h-4" />Отправить
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary">
        <div className="max-w-5xl mx-auto px-5 py-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-12" style={{ fontFamily: "'Lora', serif" }}>Вопросы и ответы</h2>
          <div className="max-w-2xl mx-auto">
            {faqItems.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-5 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="font-semibold text-foreground block mb-1 leading-tight" style={{ fontFamily: "'Lora', serif", fontSize: "17px" }}>
              Порция знакомств
            </span>
            <p className="text-sm text-muted-foreground font-sans mt-1">Бранчи и ужины для своих людей. Москва, 2026.</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground font-sans">
            <a href="https://t.me/zastolom" className="hover:text-foreground transition-colors">Telegram</a>
            <a href="https://instagram.com/zastolom" className="hover:text-foreground transition-colors">Instagram</a>
            <a href="mailto:hello@zastolom.ru" className="hover:text-foreground transition-colors">hello@zastolom.ru</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
