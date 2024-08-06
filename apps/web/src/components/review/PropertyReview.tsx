'use client';
import React, { useEffect, useState } from 'react';
import { IoStar } from 'react-icons/io5';
import dayjs from 'dayjs';
import { Review } from '@/models/review.modal';
import { axiosInstance } from '@/libs/axios.config';
import { useParams } from 'next/navigation';
import Swal from 'sweetalert2';

const PropertyReview = () => {
  const censorUsername = (name: string) => {
    const length = name.length;
    const visiblePart = name.slice(0, Math.max(0, length - 3));
    return `${visiblePart}***`;
  };
  const params = useParams();
  const { propertyId } = params;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replies, setReplies] = useState<{ [key: string]: string }>({});
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});
  const [showReplyInput, setShowReplyInput] = useState<{
    [key: string]: boolean;
  }>({});
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const reviewResponse = await axiosInstance().get(
          `/api/reviews/getReviewByPropertyId/${propertyId}`,
        );
        const { data } = reviewResponse.data; // Adjust based on your API response structure
        console.log(data);
        if (Array.isArray(data)) {
          setReviews(data); // Ensure data is an array before setting it
          // Set balasan yang sudah ada
          const existingReplies: { [key: string]: string } = {};
          data.forEach((review) => {
            if (review.reply) {
              existingReplies[review.id] = review.reply;
            }
          });
          setReplies(existingReplies);

          // Hide reply input for reviews with existing replies
          const initialReplyInputs: { [key: string]: boolean } = {};
          data.forEach((review) => {
            initialReplyInputs[review.id] = !review.reply;
          });
          setShowReplyInput(initialReplyInputs);
        } else {
          console.error('Fetched data is not an array: ', data);
        }
      } catch (error) {
        console.error('error fetching', error);
      }
    };

    fetchEventData();
  }, [propertyId]);

  const handleReplyChange = (reviewId: string, text: string) => {
    setReplyInput((prev) => ({
      ...prev,
      [reviewId]: text,
    }));
  };
  const handleReplySubmit = async (reviewId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, upload it!',
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance().post(`/api/reviews/reviewReply/${reviewId}`, {
          reviewId: reviewId,
          reply: replyInput[reviewId],
          propertyId: propertyId,
        });
        // Perbarui tampilan balasan setelah pengiriman berhasil
        setReplies((prev) => ({
          ...prev,
          [reviewId]: replyInput[reviewId],
        }));
        setReplyInput((prev) => ({
          ...prev,
          [reviewId]: '',
        }));
        setShowReplyInput((prev) => ({
          ...prev,
          [reviewId]: false,
        }));
        Swal.fire({
          title: 'Submitted!',
          text: 'Your reply has been submitted.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } catch (error) {
        console.error('Terjadi kesalahan saat mengirim balasan', error);
        Swal.fire({
          title: 'Gagal Mengirim Balasan',
          text: 'Terjadi kesalahan saat mengirim balasan Anda. Silakan coba lagi.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };
  return (
    <>
      <div className="text-lg font-bold">All Reviews</div>
      {reviews
        .filter((item) => item.rating > 0)
        .map((review) => (
          <div key={review.id}>
            <div className="flex flex-col gap-3 mt-3">
              <div className="flex flex-col gap-2 bg-white rounded-md shadow-sm p-4">
                <div className="flex justify justify-between">
                  <div className="flex gap-2">
                    <div className="w-7 h-7 text-center rounded-full bg-red-500">
                      J
                    </div>
                    <div className="flex flex-col">
                      <span>{censorUsername(review.user.first_name)}</span>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, index) => (
                          <IoStar
                            key={index}
                            className={`text-md ${
                              index < review.rating
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex p-1 gap-1 text-orange-300"></div>
                </div>
                <div>{review.review}</div>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span> {dayjs(review.updatedAt).format('DD MMMM YYYY')}</span>
                </div>
                {replies[review.id] && (
                  <div className="mt-2">
                    <div className="font-bold text-sm">Tenant Reply</div>
                    <div className="text-sm text-gray-800">
                      {replies[review.id]}
                    </div>
                  </div>
                )}
                {/* Input field untuk balasan */}
                {showReplyInput[review.id] && !replies[review.id] && (
                  <div className="mt-4">
                    <textarea
                      value={replyInput[review.id] || ''}
                      onChange={(e) =>
                        handleReplyChange(review.id, e.target.value)
                      }
                      placeholder="Tulis balasan..."
                      className="border p-2 w-full"
                    />
                    <button
                      onClick={() => handleReplySubmit(review.id)}
                      className="mt-2 bg-blue-500 text-white p-2 rounded"
                    >
                      Kirim Balasan
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default PropertyReview;
