"use client";

import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import api from '@/lib/api';

interface Comment {
  _id: string;
  username: string;
  description: string;
  profilePhoto: string;
}

export const Testimonials = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await api.get('/comments');
        setComments(data);
      } catch (err) {
        console.log(err)
        console.error('Failed to fetch testimonials');
      }
    };
    fetchComments();
  }, []);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1280) {
        setCardsPerView(3);
        return;
      }
      if (window.innerWidth >= 768) {
        setCardsPerView(2);
        return;
      }
      setCardsPerView(1);
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const maxIndex = Math.max(comments.length - cardsPerView, 0);
  const canSlidePrev = currentIndex > 0;
  const canSlideNext = currentIndex < maxIndex;

  return (
    <section className="py-24 bg-[#f0efeb] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-5xl font-serif tracking-tight text-secondary">What our Patients Say</h2>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${(100 / cardsPerView) * currentIndex}%)` }}
          >
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="shrink-0 px-3"
                style={{ width: `${100 / cardsPerView}%` }}
              >
                <article className="bg-white p-10 min-h-[260px] flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center gap-1 text-primary mb-5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-secondary/60 leading-relaxed italic">
                      {comment.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 mt-8">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-bone border border-secondary/10">
                      <img
                        src={comment.profilePhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                        alt={comment.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback";
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="text-lg text-secondary">{comment.username}</h4>
                      <p className="text-secondary/35 text-xs">Patient</p>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => canSlidePrev && setCurrentIndex((prev) => prev - 1)}
            disabled={!canSlidePrev}
            className="h-12 w-12 rounded-full border border-secondary/15 text-secondary/40 flex items-center justify-center disabled:opacity-40"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => canSlideNext && setCurrentIndex((prev) => prev + 1)}
            disabled={!canSlideNext}
            className="h-12 w-12 rounded-full border border-secondary/35 text-secondary flex items-center justify-center disabled:opacity-40"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
