/* Resource: https://v5.reactrouter.com/web/guides/scroll-restoration */
export const scrollToTop = (topOffset = 0) => {
    window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
    });
};
