'use client';

import { Review } from '@/lib/types';
import { Star } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews = [] }: ReviewsSectionProps) {
  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="border-t border-gray-200 pt-16 mt-16">
      <h2 className="text-2xl font-bold uppercase tracking-tighter mb-8">Reviews</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl font-bold">{averageRating.toFixed(1)}</span>
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-gray-500">{reviews.length} Reviews</p>
          <button className="mt-6 px-6 py-3 border border-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
            Write a Review
          </button>
        </div>

        <div className="md:col-span-2 space-y-8">
          {reviews.length === 0 ? (
            <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400 text-xs">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${star <= review.rating ? 'fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-sm">{review.user?.firstName || 'Anonymous'}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
