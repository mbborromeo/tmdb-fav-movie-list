/* Resource: https://v5.reactrouter.com/web/guides/scroll-restoration */
export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};
