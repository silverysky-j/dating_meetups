import { useState, useEffect, useRef } from "react";
import {
  ChevronDown, ArrowRight, MapPin, Calendar,
  Send, Clock, X
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

type Dinner = {
  id: number;
  title: string;
  ageRanges: string[];
  format: string;
  date: string;
  time: string;
  area: string;
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
    id: 7, title: "Смена и друзья", ageRanges: ["27–35"], format: "ужин", date: "3 августа, пн", time: "19:30",
    area: "Центр · Москва", price: "800 ₽", priceNum: 800,
    spotsM: 1, spotsF: 1, emoji: "🏕️", tag: "Комьюнити",
    description: "Стол для участников комьюнити «Станция Смена» — коворкинга-лагеря для удалёнщиков. Приходи сам или закинь приглашение другу, которому тоже откликнется этот вайб.",
    criteria: "Возраст 27–35 лет. Причастность к «Станции Смена» — участник или приглашённый друг участника.",
    question: "Как ты связан со «Сменой» — был на смене, знаешь кого-то оттуда?",
  },
  {
    id: 1, title: "Runners", ageRanges: ["22–30", "31–40"], format: "бранч", date: "8 августа, сб", time: "12:30",
    area: "Центр · Москва", price: "1 600 ₽", priceNum: 1600,
    spotsM: 0, spotsF: 2, emoji: "🏃", tag: "Спорт",
    description: "Стол для тех, кто пробежал достаточно, чтобы сравнивать кроссовки и маршруты.",
    criteria: "Возраст 22–30 или 31–40 лет. Бег как регулярная практика. Паркраны, полумарафоны, любые забеги приветствуются.",
    question: "Как давно бегаешь? Есть ли дистанция, к которой сейчас готовишься?",
  },
  {
    id: 2, title: "Скалолазы", ageRanges: ["22–30", "31–40"], format: "бранч", date: "9 августа, вс", time: "12:30",
    area: "Центр · Москва", price: "1 600 ₽", priceNum: 1600,
    spotsM: 1, spotsF: 1, emoji: "🧗", tag: "Спорт",
    description: "Стол для тех, кто регулярно лазает — на скалодроме или на настоящих скалах. Разговор найдётся сам собой, даже если маршруты и грейды у всех разные.",
    criteria: "Возраст 22–30 или 31–40 лет. Скалолазание как регулярное занятие — скалодром или натуральный рельеф.",
    question: "Как давно лазаешь и на каком скалодроме или в каких горах чаще всего бываешь?",
  },
  {
    id: 3, title: "Burners", ageRanges: ["22–30", "31–40"], format: "бранч", date: "15 августа, сб", time: "12:30",
    area: "Центр · Москва", price: "1 600 ₽", priceNum: 1600,
    spotsM: 1, spotsF: 0, emoji: "✂️", tag: "Культура",
    description: "Стол вокруг аудитории сообщества Burning Man и локальных берн комьюнити",
    criteria: "Возраст 22–30 или 31–40 лет. Участник фестивалей и приверженцы ценностей берна",
    question: "Откуда ты про нас узнал и как связан со «Сменой» или пространством вокруг неё?",
  },
  {
    id: 4, title: "Фаундеры", ageRanges: ["22–30", "31–40"], format: "бранч", date: "16 августа, вс", time: "12:30",
    area: "Центр · Москва", price: "1 600 ₽", priceNum: 1600,
    spotsM: 2, spotsF: 1, emoji: "🎨", tag: "Деятельность",
    description: "Стол для фаундеров и фаундерок. Рады участникам комьюнити Хегай, Р-Фаундерс, Атланты и других бизнес-сообществ — но записаться можно и без членства в них.",
    criteria: "Возраст 22–30 или 31–40 лет. Причастность к предпринимательству — работа, практика или активный интерес. Анкету читаем внимательно.",
    question: "Как ты связан с бизнесом? Чем занимаешься — что создаёшь и продаёшь?",
  }, 
  {
    id: 5, title: "Рядом: Верх Зеленой", ageRanges: ["22–30", "31–40"], format: "бранч", date: "29 августа, сб", time: "12:30",
    area: "Центр · Москва", price: "1 600 ₽", priceNum: 1600,
    spotsM: 2, spotsF: 1, emoji: "📍", tag: "Соседи",
    description: "Стол для тех, кто живёт наверху зелёной ветки метро — от Ховрино до Белорусской. Чтобы наконец познакомиться с соседями, а не только с людьми с другого конца города.",
    criteria: "Возраст 22–30 или 31–40 лет. Живёшь в районе от Ховрино до Белорусской или готов сюда приезжать.",
    question: "Как долго живёшь в этом районе и что тебе в нём больше всего нравится?",
  }, 
  {
    id: 6, title: "Состоятельные", ageRanges: ["22–30", "31–40"], format: "бранч", date: "30 августа, вс", time: "12:30",
    area: "Центр · Москва", price: "16 000 ₽", priceNum: 16000,
    spotsM: 1, spotsF: 1, emoji: "🍷", tag: "Премиум",
    description: "Давайте честно, чаще всего люди образуют пары с человеком из своего социального слоя, потому что эти люди могут друг друга понять, а их образ жизни схож и совместим. Эта встреча имеет заградительную цену и предназначена для тех, кто легко может потратить 16 000 на небольшой социальный эксперимент. Отбор строже — анкета и разговор с организатором.",
    criteria: "Возраст 22–30 или 31–40 лет. Old Money, New Money — не важно. Не берем тех, кто ищет спонсора. Проводим короткий звонок перед подтверждением.",
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
  const isPremium = dinner.tag === "Золото";
  return (
    <div
      onClick={onOpen}
      className={`rounded-2xl p-6 flex flex-col gap-4 border transition-all duration-300 cursor-pointer group ${
        isPremium
          ? "bg-gradient-to-br from-[#FBF3DC] to-[#F0DFA9] border-[#D4AF37]/50 hover:border-[#D4AF37] hover:shadow-lg"
          : "bg-card border-border hover:shadow-md hover:border-primary/30"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className={`text-xs font-medium tracking-wide uppercase font-sans ${isPremium ? "text-[#8A6D1D]" : "text-muted-foreground"}`}>{dinner.tag}</span>
          <h3 className="text-xl font-display font-semibold text-foreground mt-0.5 leading-tight" style={{ fontFamily: "'Lora', serif" }}>
            {dinner.emoji} {dinner.title}
          </h3>
        </div>
        <span className={`text-lg font-semibold whitespace-nowrap ${isPremium ? "text-[#8A6D1D]" : "text-primary"}`} style={{ fontFamily: "'Lora', serif" }}>{dinner.price}</span>
      </div>
      <div className="flex gap-2">
        {dinner.ageRanges.map((r) => (
          <span key={r} className={`text-xs font-sans font-medium px-2.5 py-1 rounded-full ${isPremium ? "text-[#8A6D1D] bg-[#D4AF37]/15" : "text-primary bg-primary/10"}`}>{r} лет</span>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
          <Clock className="w-4 h-4 shrink-0" />{dinner.format}, {weekday} {dinner.time}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
          <Calendar className="w-4 h-4 shrink-0" />{dinner.date}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
          <MapPin className="w-4 h-4 shrink-0" />{dinner.area}
        </div>
      </div>
      <div className={`mt-auto pt-2 border-t ${isPremium ? "border-[#D4AF37]/30" : "border-border"}`}>
        <button
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          className={`w-full py-2.5 rounded-xl text-sm font-sans font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] ${
            isPremium
              ? "bg-gradient-to-r from-[#D4AF37] to-[#B8942A] text-white hover:opacity-90"
              : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          Подробнее <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function DinnerModal({ dinner, onClose }: { dinner: Dinner; onClose: () => void }) {
  useBodyLock(true);
  const overlayRef = useRef<HTMLDivElement>(null);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const telegramHref = `https://t.me/portion_admin?text=${encodeURIComponent(`Привет, меня заинтересовал стол ${dinner.title}`)}`;
  const isPremium = dinner.tag === "Премиум";

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
    >
      <div className="bg-background w-full sm:max-w-xl max-h-[96dvh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <p className="text-xs text-muted-foreground font-sans">{dinner.tag}</p>
            <h2 className="font-semibold text-foreground text-base leading-tight" style={{ fontFamily: "'Lora', serif" }}>
              {dinner.emoji} {dinner.title}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          <div className="px-6 py-6 flex flex-col gap-6">
            {/* Meta */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
                <Calendar className="w-4 h-4 shrink-0" />
                {dinner.format}, {dinner.date} · {dinner.time}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
                <MapPin className="w-4 h-4 shrink-0" />
                {dinner.area}
              </div>
            </div>

            {/* Age ranges */}
            <div className="flex gap-2">
              {dinner.ageRanges.map((r) => (
                <span key={r} className={`text-xs font-sans font-medium px-2.5 py-1 rounded-full ${isPremium ? "text-[#8A6D1D] bg-[#D4AF37]/15" : "text-primary bg-primary/10"}`}>{r} лет</span>
              ))}
            </div>

            {/* Who this table is for */}
            <div>
              <h3 className="font-sans font-semibold text-foreground mb-2">Для кого этот стол</h3>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">{dinner.description}</p>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed mt-3">{dinner.criteria}</p>
            </div>

            {/* How it goes */}
            <div className="border border-border rounded-2xl p-5 flex flex-col gap-3">
              <h3 className="font-sans font-semibold text-foreground">Как проходит встреча</h3>
              <ul className="flex flex-col gap-2">
                {[
                  "Все участники сейчас вне отношений и открыты к знакомству, но мы предлагаем настроиться на дружеский вайб — пока это только знакомство, а не свидание",
                  "Мы пришлём вопросы, которые помогут начать знакомиться",
                  "Каждый платит за себя",
                  "~1,5–2 часа за одним столом",
                  "Место: ресторан в центре Москвы, сообщим ближе к встрече",
                  "После встречи вы можете обменяться контактами сами или попросить админа уточнить у понравившегося человека, не против ли он или она",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-muted-foreground font-sans">
                    <span className="text-primary mt-0.5 shrink-0">·</span>{item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price line */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground font-sans">Стоимость бронирования</span>
              <span className="text-xl font-semibold text-foreground" style={{ fontFamily: "'Lora', serif" }}>{dinner.price}</span>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 border-t border-border shrink-0 bg-background">
          <a
            href={telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-3.5 rounded-xl font-sans font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 ${
              isPremium ? "bg-gradient-to-r from-[#D4AF37] to-[#B8942A] text-white" : "bg-primary text-primary-foreground"
            }`}
          >
            <Send className="w-4 h-4" /> Записаться — перейти в Telegram
          </a>
        </div>
      </div>
    </div>
  );
}


// ─── FAQ ──────────────────────────────────────────────────────────────────────

const faqItems = [
  { q: "За что я плачу?", a: "За знакомство с близкими по духу синглами без необходимости свайпать и вести переписки" },
  { q: "Что если я не смогу прийти?", a: "Если отменяешь бронь не позднее чем за 24 часа до встречи — вернём полную сумму. Если позже и вместе с нами не получится найти замену — оплата, к сожалению, не возвращается." },
  { q: "А если отменится кто-то другой?", a: "Если из стола выбывает участник противоположного вам пола, мы вернём треть стоимости — потому что знакомств на встрече будет меньше. Минимальный состав, с которым стол ещё состоится, — двое мужчин и две женщины. Если набрать меньше не получается, мы напишем об отмене всей встречи." },
  { q: "Можно прийти с другом?", a: "Да, ваш друг может купить участие в том же столе. Главное, чтобы вы были настроены открыто к новым людям за столом." },
  { q: "Как проверяются участники?", a: "У нас нет анонимных участников: имя, фамилия, возраст и ссылка на Telegram обязательны. Еще мы просим у каждого участника небольшое био." },

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

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {activeModal && <DinnerModal dinner={activeModal} onClose={() => setActiveModal(null)} />}

      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <img src="https://res.cloudinary.com/dnxwuzbau/image/upload/v1785149907/logo1_dating_xbdik0.png" alt="" className="h-12 w-auto object-contain" />
            <span className="font-semibold text-foreground leading-tight" style={{ fontFamily: "'Lora', serif", fontSize: "18px" }}>
              Порция знакомств
            </span>
          </span>
          <button onClick={() => scrollTo("dinners")} className="text-sm font-medium text-primary hover:opacity-80 transition-opacity">
            Смотреть ужины
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://res.cloudinary.com/dnxwuzbau/image/upload/v1785185819/a602d89b-5801-4c04-865d-98924aeb6723_bhdeys.png"
            alt=""
            className="w-full h-full object-cover opacity-[0.12]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/75 to-background" />
        </div>
        <div className="relative max-w-5xl mx-auto px-5 pt-20 pb-24 text-center">
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
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-secondary">
        <div className="max-w-5xl mx-auto px-5 py-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-14" style={{ fontFamily: "'Lora', serif" }}>Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { n: "01", title: "Выбери стол", desc: "Находишь стол, который подходит по возрасту и образу жизни." },
              { n: "02", title: "Записывайся", desc: "Кнопка «Записаться» направит тебя к нашему админу — он ответит на все вопросы." },
              { n: "03", title: "Приходи", desc: "В назначенный день — в ресторан. С нас — вопросы, которые помогут начать знакомство. С тебя — хорошее настроение." },
              { n: "04", title: "Продолжай общаться", desc: "Напиши тем, кто понравился, чтобы договориться о новой встрече." },
            ].map((step) => (
              <div key={step.n} className="flex flex-col gap-3">
                <span className="text-4xl font-semibold text-primary/30" style={{ fontFamily: "'Lora', serif" }}>{step.n}</span>
                <h3 className="font-sans font-semibold text-foreground text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DINNERS */}
      <section id="dinners" className="max-w-5xl mx-auto px-5 py-20">
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-4" style={{ fontFamily: "'Lora', serif" }}>Открытые столы</h2>
        <p className="text-center text-muted-foreground font-sans mb-12">{dinners.length} столов в этом сезоне</p>
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
              { emoji: "🍽️", title: "Общий стол на шестерых", desc: "Трое мужчин и три женщины, объединённые общим образом жизни." },
              { emoji: "🎲", title: "Игра-знакомство в начале", desc: "Пришлём вопросы, которые помогут разговориться с первых минут." },
              { emoji: "💬", title: "~1,5–2 часа разговора", desc: "Достаточно, чтобы понять, есть ли химия — без спешки и неловкости." },
              { emoji: "💳", title: "Каждый платит за себя", desc: "Оплата в ресторане как обычно, на месте. Заранее мы берём только организационный взнос" },
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
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6" style={{ fontFamily: "'Lora', serif" }}>О проекте</h2>
          <p className="text-muted-foreground font-sans leading-relaxed">
            <strong className="text-foreground font-semibold">Порция знакомств</strong> — это бранчи и ужины для тех, кто не в отношениях и открыт к знакомствам.
          </p>
          <p className="text-muted-foreground font-sans leading-relaxed mt-4">
            Мы собираем участников так, чтобы шанс встретить своего человека был выше чем в дейтинг-приложениях: собираем столы из людей с общим образом жизни или ценностями — бегунов с бегунами, бёрнеров с бёрнерами.
          </p>
          <p className="text-muted-foreground font-sans leading-relaxed mt-4">
            Сама встреча — не свидание и уж тем более не смотрины. Ужин — это возможность узнать несколько классных новых людей. И заодно — дать судьбе ещё одну попытку свести вас с нужным человеком, без лишнего давления.
          </p>
          <p className="text-muted-foreground font-sans leading-relaxed mt-4">
            Знаете анекдот про «да ты хоть лотерейный билет купи»? Многие из нас хотят встретить своего человека, но не тянут билет — не знакомятся с новыми людьми. А может, стоит?
          </p>
          <p className="text-muted-foreground font-sans leading-relaxed mt-4">
            Кстати, иногда на такой встрече находишь просто человека, близкого по духу, друга — а он потом знакомит тебя со своим человеком.
          </p>
        </div>
      </section>

      {/* CREATORS */}
      <section className="max-w-5xl mx-auto px-5 py-20">
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-12" style={{ fontFamily: "'Lora', serif" }}>
          Кто за этим стоит
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          {/* Юля */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="h-64 bg-muted overflow-hidden">
              <img
                src="https://res.cloudinary.com/dnxwuzbau/image/upload/v1785264064/IMG20251209210939_fnpb6i.jpg"
                alt="Юлия Серебрийская"
                className="w-full h-full object-cover"
                style={{ objectPosition: "center 50%" }}
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-1" style={{ fontFamily: "'Lora', serif" }}>
                Юлия Серебрийская
              </h3>
              <p className="text-xs font-sans font-medium text-primary uppercase tracking-widest mb-3">Основатель</p>
              <div className="text-sm text-muted-foreground font-sans leading-relaxed flex flex-col gap-3">
                <p>Привет, я Юля, и в детстве я очень любила романтические комедии.</p>
                <p>Я выросла, стала руководителем аналитики, номадом, предпринимателем — но с ромкомами ничего не изменилось, я всё ещё их люблю. И иногда создаю.</p>
                <p>Весной 2026 года я вела мастермайнд про дейтинг — к концу 2 из 5 участников были в отношениях. Конечно, в основном благодаря им самим и волею судьбы, но и наши встречи внесли какую-то лепту.</p>
                <p>Этот проект я делаю с надеждой, что кто-то из вас встретит своего человека — того, с кем нестрашно и весело строить жизнь.</p>
              </div>
            </div>
          </div>

          {/* Открытая позиция */}
          <div className="bg-card border border-dashed border-border rounded-2xl overflow-hidden">
            <div className="h-64 bg-muted overflow-hidden flex items-center justify-center bg-gradient-to-br from-secondary to-secondary">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center">
                <span className="text-3xl font-semibold text-primary/50" style={{ fontFamily: "'Lora', serif" }}>?</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-1" style={{ fontFamily: "'Lora', serif" }}>
                Возможно, это вы?
              </h3>
              <p className="text-xs font-sans font-medium text-primary uppercase tracking-widest mb-3">Это место пока свободно</p>
              <div className="text-sm text-muted-foreground font-sans leading-relaxed flex flex-col gap-3">
                <p>Партнёрство — одна из больших ценностей для меня (Юли). У проекта впереди долгий путь со своими вызовами. И для устойчивости на этом пути мне нужен человек, с которым я иду плечом к плечу к одной цели.</p>
                <p>
                  Если вы видите, как могли бы принести пользу проекту — напишите в телеграм: {" "}
                  <a href="https://t.me/portion_admin" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">t.me/portion_admin</a>. Особенно ценно, если у вас есть опыт в маркетинге ивент-проектов, но это не обязательное условие. Возможно, пазл складывается иначе :)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section className="bg-secondary">
        <div className="max-w-5xl mx-auto px-5 py-20">
          <div className="max-w-xl mx-auto text-center">
            <Clock className="w-8 h-8 text-primary mx-auto mb-5" />
            <h2 className="text-3xl font-semibold text-foreground mb-3" style={{ fontFamily: "'Lora', serif" }}>Какой стол ещё нужен в проекте?</h2>
            <p className="text-muted-foreground font-sans leading-relaxed">
              Если не видите стола для себя — будем очень рады вашим идеям и предложениям, пишите в Telegram: {" "}
              <a href="https://t.me/portion_admin" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">t.me/portion_admin</a>. Если просто хотите узнавать о новых столах — пишите туда же.
            </p>
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
            <a href="https://t.me/portion_admin" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Telegram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
