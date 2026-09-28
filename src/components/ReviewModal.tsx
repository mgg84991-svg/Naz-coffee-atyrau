import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  X,
  Star,
  MessageSquare,
  CheckCircle2,
  Send,
  ExternalLink,
} from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const {
    isReviewModalOpen,
    setIsReviewModalOpen,
    addReview,
    user,
    brand,
  } = useCoffee();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Ароматный кофе', 'Быстрая подача']);
  const [comment, setComment] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>(user.name || 'Гость');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [submittedReviewText, setSubmittedReviewText] = useState<string>('');

  if (!isReviewModalOpen) return null;

  const availableTags = [
    'Ароматный кофе',
    'Быстрая подача',
    'Идеальная пенка',
    'Вежливый бариста',
    'Приятная атмосфера',
    'Свежие круассаны',
    'Удобный заказ',
    'Быстрый Wi-Fi в Атырау',
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const formattedComment = comment.trim();
    addReview({
      customerName: authorName.trim() || 'Гость кофейни',
      rating,
      tags: selectedTags,
      comment: formattedComment,
    });

    const tgMessage = `💬 Новый отзыв в NAZ COFFEE (Атырау)!\nОценка: ${rating}/5 ⭐\nГость: ${authorName.trim() || 'Гость'}\nТеги: ${selectedTags.join(', ')}\nОтзыв: «${formattedComment}»`;
    setSubmittedReviewText(tgMessage);

    setIsSuccess(true);
  };

  const telegramUrl = `https://t.me/${brand.telegramUsername || 'GainidenMadina'}?text=${encodeURIComponent(submittedReviewText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231c16]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#ffffff] border border-[#e8dfd5] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0eae3] bg-[#faf6f0]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#f0e6da] border border-[#ded0c1] text-[#935a22]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#231c16]">
                Оценка качества обслуживания
              </h3>
              <p className="text-xs text-[#705e4f]">
                {brand.shopName} • Отзыв поступит напрямую {brand.ownerName}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsReviewModalOpen(false);
              setIsSuccess(false);
              setComment('');
            }}
            className="p-2 text-[#705e4f] hover:text-[#231c16] rounded-xl hover:bg-[#ede5dc] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600 shadow-xs animate-in zoom-in">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                ✓ Отправлено в Telegram
              </span>
              <h4 className="font-display text-2xl font-bold text-[#231c16] mt-2">
                Большое спасибо за отзыв!
              </h4>
              <p className="text-xs text-[#705e4f] max-w-sm mx-auto mt-1">
                Ваш отклик поступил владелице кофейни <strong>{brand.ownerName}</strong> в Telegram (@{brand.telegramUsername}).
              </p>
            </div>

            {/* Direct Telegram link button */}
            <div className="p-4 rounded-2xl bg-[#f0f8ff] border border-[#b9e2fe] text-left space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 text-[#0369a1] text-xs font-bold">
                <Send className="w-4 h-4 text-[#0284c7]" />
                <span>Связь с {brand.ownerName} в Telegram</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Вы также можете открыть чат с {brand.ownerName} в Telegram напрямую и отправить сообщение лично:
              </p>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#24A1DE] hover:bg-[#1f8ec4] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Открыть Telegram (@{brand.telegramUsername})</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>

            <button
              onClick={() => {
                setIsSuccess(false);
                setIsReviewModalOpen(false);
                setComment('');
              }}
              className="w-full py-3 rounded-xl bg-[#faf6f0] hover:bg-[#f0e6da] border border-[#e8dfd5] text-[#231c16] text-xs font-bold transition-colors cursor-pointer"
            >
              Вернуться в кофейню
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Direct Notice about Telegram recipient */}
            <div className="p-3 rounded-xl bg-[#f0f8ff] border border-[#b9e2fe] flex items-center gap-2.5 text-xs text-[#0369a1]">
              <Send className="w-4 h-4 shrink-0 text-[#0284c7]" />
              <span>
                Все отзывы поступают напрямую к владелице кофейни <strong>{brand.ownerName}</strong> в Telegram (@{brand.telegramUsername}).
              </span>
            </div>

            {/* Star Rating Picker */}
            <div className="text-center space-y-2">
              <label className="text-xs font-bold text-[#705e4f] uppercase tracking-wider block">
                Как вы оцениваете напитки и сервис в Атырау?
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-[#e8dfd5] hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          filled
                            ? 'text-[#f59e0b] fill-[#f59e0b]'
                            : 'text-[#e8dfd5]'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs text-[#935a22] font-bold">
                {rating === 5
                  ? '5 / 5 • Идеальный спешелти кофе!'
                  : rating === 4
                  ? '4 / 5 • Очень вкусно'
                  : rating === 3
                  ? '3 / 5 • Нормально'
                  : 'Мы обязательно улучшим качество'}
              </span>
            </div>

            {/* Tags Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#705e4f] uppercase tracking-wider block">
                Что вам понравилось?
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#935a22] border-[#935a22] text-white shadow-xs'
                          : 'bg-[#faf6f0] border-[#e8dfd5] text-[#705e4f] hover:border-[#b89f88] hover:bg-white'
                      }`}
                    >
                      {isSelected ? '✓ ' : ''}{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Author Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#231c16]">Ваше имя</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Айгерим"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf6f0] border border-[#e8dfd5] text-xs text-[#231c16] placeholder-[#a69687] focus:border-[#935a22] focus:bg-white outline-none"
              />
            </div>

            {/* Comment */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#231c16]">
                Ваш отзыв или пожелание
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Поделитесь впечатлением о напитках, обжарке кофе, десертах или атмосфере..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf6f0] border border-[#e8dfd5] text-xs text-[#231c16] placeholder-[#a69687] focus:border-[#935a22] focus:bg-white outline-none resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#935a22] hover:bg-[#7e4c1b] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Отправить отзыв в Telegram {brand.ownerName}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
