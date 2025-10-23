/**
 *
 * List
 *
 */

import React from 'react';

import ReactStars from 'react-rating-stars-component';

import { formatDate } from '../../../utils/date';
import { getMemoizedRandomColors } from '../../../utils';

const List = props => {
  const { reviews } = props;

  const getAvatar = review => {
    const initialsSource =
      review?.user?._id ||
      review?.user?.firstName ||
      review?._id ||
      review?.created;
    const color = getMemoizedRandomColors(initialsSource);

    if (review.user?.firstName) {
      return (
        <div
          className='d-flex flex-column justify-content-center align-items-center fw-normal text-white avatar'
          style={{ backgroundColor: color ? color : 'red' }}
        >
          {review.user.firstName.charAt(0)}
        </div>
      );
    }

    return (
      <div
        className='d-flex flex-column justify-content-center align-items-center fw-normal text-white avatar'
        style={{ backgroundColor: color ? color : 'red' }}
      >
        ?
      </div>
    );
  };

  return (
    <div className='review-list'>
      {reviews.map(review => {
        const key =
          review?._id ||
          `${review?.user?._id || review?.user?.firstName || 'review'}-${
            review?.created
          }`;
        return (
          <div className='d-flex align-items-center mb-3 review-box' key={key}>
          <div className='mx-3'>{getAvatar(review)}</div>
          <div className='p-3 p-lg-4 w-100'>
            <div className='d-flex align-items-center justify-content-between'>
              <h4 className='mb-0 mr-2 one-line-ellipsis'>
                {review.user?.firstName || 'Customer'}
              </h4>
              <ReactStars
                classNames='mr-2'
                size={16}
                edit={false}
                color={'#adb5bd'}
                activeColor={'#ffb302'}
                a11y={true}
                isHalf={true}
                emptyIcon={<i className='fa fa-star' />}
                halfIcon={<i className='fa fa-star-half-alt' />}
                filledIcon={<i className='fa fa-star' />}
                value={Number(review.rating) || 0}
              />
            </div>
            <p className='mb-2 fs-12'>{formatDate(`${review?.created}`)}</p>
            <p className='mb-0 three-line-ellipsis word-break-all'>{`${review?.review}`}</p>
          </div>
        </div>
        );
      })}
    </div>
  );
};

export default React.memo(List);
