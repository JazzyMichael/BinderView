import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface InfiniteScroll {
  children?: ReactNode;
  element?: keyof HTMLElementTagNameMap;
  hasMore?: boolean;
  loadMore: Function;
  loader?: ReactNode;
  initialLoad?: boolean;
  pageStart?: number;
  threshold?: number;
  isReverse?: boolean;
  useCapture?: boolean;
  useWindow?: boolean;
  getScrollParent?: Function;
}

export default function InfiniteScroll({
  children,
  loadMore,
  element: Element = "div",
  hasMore = false,
  initialLoad = true,
  isReverse = false,
  loader = null,
  pageStart = 0,
  getScrollParent = null,
  threshold = 250,
  useCapture = false,
  useWindow = false,
  ...props
}: InfiniteScroll) {
  const scrollComponentRef = useRef(null);
  const [pageLoaded, setPageLoaded] = useState(pageStart);
  const [beforeScrollHeight, setBeforeScrollHeight] = useState(0);
  const [beforeScrollTop, setBeforeScrollTop] = useState(0);
  const [loadMoreFlag, setLoadMoreFlag] = useState(false);

  const isPassiveSupported = useCallback(() => {
    let passive = false;
    try {
      // will throw error if passive is not supported
      const options = {
        get passive() {
          passive = true;
          return false;
        },
      };
      window.addEventListener("check-support", null, options);
      window.removeEventListener("check-support", null);
    } catch (e) {
      console.log(e);
    }
    return passive;
  }, []);

  const getParentElement = useCallback(() => {
    return getScrollParent
      ? getScrollParent()
      : scrollComponentRef.current?.parentNode;
  }, [getScrollParent]);

  const scrollListener = useCallback(() => {
    if (!scrollComponentRef.current) return;

    const el = scrollComponentRef.current;
    const parentNode = getParentElement();
    let offset;

    if (useWindow) {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      offset = isReverse
        ? scrollTop
        : el.getBoundingClientRect().bottom - window.innerHeight;
    } else {
      offset = isReverse
        ? parentNode.scrollTop
        : el.scrollHeight - parentNode.scrollTop - parentNode.clientHeight;
    }

    if (offset < threshold && el.offsetParent !== null) {
      detachScrollListener();
      setBeforeScrollHeight(parentNode.scrollHeight);
      setBeforeScrollTop(parentNode.scrollTop);
      if (typeof loadMore === "function") {
        loadMore(pageLoaded + 1);
        setPageLoaded((prev) => prev + 1);
        setLoadMoreFlag(true);
      }
    }
  }, [getParentElement, isReverse, loadMore, pageLoaded, threshold, useWindow]);

  const attachScrollListener = useCallback(() => {
    if (!hasMore) return;

    const parentElement = getParentElement();
    if (!parentElement) return;

    const scrollEl = useWindow ? window : parentElement;
    const options = isPassiveSupported()
      ? { passive: true, useCapture }
      : { passive: false };

    scrollEl.addEventListener("scroll", scrollListener, options);
    scrollEl.addEventListener("resize", scrollListener, options);

    if (initialLoad) {
      scrollListener();
    }
  }, [
    getParentElement,
    hasMore,
    initialLoad,
    isPassiveSupported,
    scrollListener,
    useCapture,
    useWindow,
  ]);

  const detachScrollListener = useCallback(() => {
    const parentElement = getParentElement();
    if (!parentElement) return;

    const scrollEl = useWindow ? window : parentElement;
    scrollEl.removeEventListener("scroll", scrollListener, useCapture);
    scrollEl.removeEventListener("resize", scrollListener, useCapture);
  }, [getParentElement, scrollListener, useCapture, useWindow]);

  useEffect(() => {
    attachScrollListener();
    return () => detachScrollListener();
  }, [attachScrollListener, detachScrollListener]);

  useEffect(() => {
    if (isReverse && loadMoreFlag) {
      const parentElement = getParentElement();
      parentElement.scrollTop =
        parentElement.scrollHeight - beforeScrollHeight + beforeScrollTop;
      setLoadMoreFlag(false);
    }
  }, [
    isReverse,
    loadMoreFlag,
    beforeScrollHeight,
    beforeScrollTop,
    getParentElement,
  ]);

  return (
    // @ts-ignore :(
    <Element ref={scrollComponentRef} {...props}>
      {isReverse && hasMore && loader}
      {children}
      {!isReverse && hasMore && loader}
    </Element>
  );
}
