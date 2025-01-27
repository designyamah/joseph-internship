import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const HotCollections = () => {
  const [hotcollection, setHotCollection] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 4,
      spacing: 15,
    },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: 3, spacing: 10 },
      },
      "(max-width: 768px)": {
        slides: { perView: 2, spacing: 10 },
      },
      "(max-width: 480px)": {
        slides: { perView: 1, spacing: 5 },
      },
    },
  });

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
        );
        setHotCollection(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
        </div>

        {/* Slider Container */}
        <div className="keen-slider-container">
          {/* Left Arrow */}
          <button
            className="arrow left-arrow"
            onClick={() => instanceRef.current?.prev()}
          >
            &#8249;
          </button>

          {/* Keen Slider */}
          <div ref={sliderRef} className="keen-slider">
            {hotcollection.map((hotColl) => (
              <div
                className="keen-slider__slide col-lg-3 col-md-6 col-sm-6 col-xs-12"
                key={hotColl.authorId}
                style={{ padding: 0 }}
              >
                <div className="nft_coll">
                  <div className="nft_wrap">
                    <Link to="/item-details">
                      <img
                        src={hotColl.nftImage}
                        className="lazy img-fluid"
                        alt={hotColl.authorImage}
                        style={{ height: "100%", width: "100%" }}
                      />
                    </Link>
                  </div>
                  <div className="nft_coll_pp">
                    <Link to="/author">
                      <img
                        className="lazy pp-coll"
                        src={hotColl.authorImage}
                        alt=""
                      />
                    </Link>
                    <i className="fa fa-check"></i>
                  </div>
                  <div className="nft_coll_info">
                    <Link to="/explore">
                      <h4>{hotColl.title}</h4>
                    </Link>
                    <span>ERC-{hotColl.code}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            className="arrow right-arrow"
            onClick={() => instanceRef.current?.next()}
          >
            &#8250;
          </button>
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
