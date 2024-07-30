import React from 'react';
import { IoClose } from 'react-icons/io5';

interface ReviewModalProps {
  order: any;
  rating: number;
  reviewText: string;
  onRatingChange: (rating: number) => void;
  onReviewTextChange: (text: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  order,
  rating,
  reviewText,
  onRatingChange,
  onReviewTextChange,
  onClose,
  onSubmit,
}) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      tabIndex={0}
    >
      <div
        className="bg-white rounded-lg p-6 w-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-600"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>
        <h2 className="text-lg font-bold mb-4">Review Event</h2>
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, index) => (
            <button
              key={index}
              className={`text-2xl ${
                rating > index ? 'text-yellow-400' : 'text-gray-300'
              }`}
              onClick={() => onRatingChange(index + 1)}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          className="w-full border p-2 rounded-lg"
          rows={3}
          maxLength={100}
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) => onReviewTextChange(e.target.value)}
        />
        <div className="text-sm text-gray-500 text-right mb-4">
          {reviewText.length}/100
        </div>
        <div className="flex justify-between">
          <button
            className="py-2 px-4 bg-blue-600 text-white rounded-md"
            onClick={onSubmit}
          >
            Submit Review
          </button>
          <button
            className="py-2 px-4 bg-gray-500 text-white rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
