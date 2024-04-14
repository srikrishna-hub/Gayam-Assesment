import React, { useState } from 'react';
import verified from "../images/verified-active.svg"
import like from "../images/favorite.svg"
import share from "../images/share.svg"
import background from "../images/background.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faSpinner } from '@fortawesome/free-solid-svg-icons'
import './index.scss';

const Card = ({ cardData }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleNextImage = () => {
        const newIndex = (currentImageIndex + 1) % cardData?.land_media.length;
        setCurrentImageIndex(newIndex);
    };

    const handlePrevImage = () => {
        const newIndex = (currentImageIndex - 1 + cardData?.land_media.length) % cardData?.land_media.length;
        setCurrentImageIndex(newIndex);
    };

    const getLandSize = (lSize) => {
        if (lSize?.acres && lSize?.guntas) {
            return `${lSize?.acres} Acres ${lSize?.guntas} Guntas`
        } else if (lSize?.acres) {
            return `${lSize?.acres} Acres`
        } else if (lSize?.guntas) {
            return `${lSize?.guntas} Guntas`
        }
    }

    const getLandPrice = (lPrice) => {
        const lSize = cardData?.total_land_size_in_acres
        if (lSize?.acres) {
            return lPrice?.crore > 0 ? `${lPrice?.crore}.${Number(lPrice?.lakh)} crores per acre` : `${lPrice?.lakh} crores per acre`
        } else if (lSize?.guntas && lPrice?.crore) {
            return lPrice?.crore > 0 ? `${lPrice?.crore}.${Number(lPrice?.lakh)} crores for full property` : `${lPrice?.lakh} crores per acre`
        } else if (lSize?.guntas && !lPrice?.crore) {
            return lPrice?.crore > 0 ? `${lPrice?.crore}.${Number(lPrice?.lakh)} lakh for full property` : `${lPrice?.lakh} crores per acre`
        }
    }

    return (
        <div className="card" key={cardData?.id}>
            <div className="image-carousel">
                <div className='img-container'>
                    <img src={cardData?.land_media?.length > 0 ? cardData?.land_media[currentImageIndex]?.image : background} alt="Carousel" className="land-image" />
                </div>
                <div className="carousel-overlay">
                    <button className="carousel-button left" onClick={handlePrevImage}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button className="carousel-button right" onClick={handleNextImage}>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                    <div class="badge-option">
                        <div class="desktop item">
                            <img src={share} alt='share' />
                        </div>
                        <div class="item">
                            <img src={like} alt='like' />
                        </div>
                    </div>
                </div>
            </div>
            <div className="image-description">
                <div class="title">
                    <div class="sub-title">
                        <div>{`${cardData?.village_name}, ${cardData?.mandal_name}`}</div>
                        <img src={verified} alt='verified' />
                    </div>
                    <div className='dist'>{`${cardData?.district_name}(dt)`}</div>
                </div>
                <div class="details"><b>{getLandSize(cardData?.total_land_size_in_acres)} </b> • ₹ {getLandPrice(cardData?.price_per_acre_crore)}</div>
            </div>
        </div>
    );
};

export default Card;
