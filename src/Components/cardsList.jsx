import React, { useState, useRef, useEffect } from 'react';
import Card from './Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const CardList = () => {
    const [cardsList, setCardsList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const loaderRef = useRef(null);


    const fetchCards = async () => {
        try {
            const response = await fetch(`https://prod-be.1acre.in/lands/?ordering=-updated_at&page=${currentPage}&page_size=10`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            if (response?.status === 200) {
                const data = await response.json();
                if (data?.results?.length > 0) {
                    const updatedData = cardsList.length > 0 ? [...cardsList, ...data?.results] : data?.results
                    setCardsList((prevstate) => [...prevstate, ...data?.results]);
                    setTotalCount(data?.count);
                    setCurrentPage((currentPage) => currentPage + 1)
                    if (updatedData.length < data.count) {
                        setHasMore(true);
                    }
                } else {
                    setHasMore(false);
                }
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching card data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (cardsList.length === 0) {
            setLoading(true);
            fetchCards();
        }
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries && entries[0].isIntersecting && hasMore && cardsList?.length < totalCount) {
                    setLoading(true);
                    fetchCards();
                }
            },
            { threshold: 1 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [loaderRef, currentPage]);

    return (
        <>
            <div className="card-list">
                {cardsList?.length > 0 && (
                    <div className="cards-container">
                        {cardsList.map((card) => (
                            <div className='card-wrapper'><Card cardData={card} /></div>
                        ))}
                    </div>
                )}
                {loading && (
                    <FontAwesomeIcon icon={faSpinner} spin className='spinner' />
                )}
            </div>
            <div ref={loaderRef} />
        </>
    );
};

export default CardList;
