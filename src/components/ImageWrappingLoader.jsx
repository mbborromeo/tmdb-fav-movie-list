import { useState, useEffect } from 'react';

/* Resource: https://blog.logrocket.com/progressive-image-loading-react-tutorial */
const ImageWrappingLoader = ({ imageSrc, imageAlt, className }) => {
    const [imgSrc, setImgSrc] = useState(null);

    /* load an invisible image tag (not placed on page) for loading purposes */
    useEffect(() => {
        const imgInvisible = new Image();
        imgInvisible.src = imageSrc;
        /* set image's source when image has loaded */
        imgInvisible.onload = () => {
            setImgSrc(imageSrc);
        };
    }, [imageSrc]);

    const customClasses = className
        ? `${className}${!imgSrc ? ' loading' : ''}`
        : !imgSrc
          ? 'loading'
          : '';

    return (
        <span className={customClasses}>
            {imgSrc && (
                <img
                    src={imgSrc}
                    alt={imageAlt} // needs to be explicitly defined for img
                />
            )}
        </span>
    );
};

export default ImageWrappingLoader;
