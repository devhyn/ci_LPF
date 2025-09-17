/**
 * 웹페이지에 주입되어 상품 정보를 추출하고 다나와 검색 URL을 생성하는 함수.
 */
function getProductInfo() {
  const currentUrl = window.location.href;
  let searchQuery = "";

  // 네이버 스토어
  if (currentUrl.includes("naver")) {
    const allElements = document.querySelectorAll("*");
    for (const element of allElements) {
      if (element.innerText && element.innerText.trim() === "모델명") {
        const nextElement = element.nextElementSibling;
        if (nextElement) {
          searchQuery = nextElement.innerText.trim();
          break;
        }
      }
    }
  }
  // 쿠팡
  else if (currentUrl.includes("coupang")) {
    const titleElement = document.querySelector(".prod-buy-header__title");
    if (titleElement) {
      searchQuery = titleElement.innerText.trim();
    }
  }

  // 검색어 예외 처리 및 기본값 설정
  if (
    !searchQuery ||
    searchQuery.includes("상세참조") ||
    searchQuery.includes("컨텐츠")
  ) {
    searchQuery = document.title.replace(/\|.*$/, "").replace(/-.*/, "").trim();
  }

  // 최종 URL 반환
  if (searchQuery) {
    return `https://search.danawa.com/dsearch.php?query=${encodeURIComponent(
      searchQuery
    )}`;
  }
  return null;
}

/**
 * 아이콘 클릭 이벤트 리스너
 */
chrome.action.onClicked.addListener(async (tab) => {
  try {
    const injectionResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: getProductInfo,
    });

    const danawaUrl = injectionResults[0].result;

    if (danawaUrl) {
      chrome.tabs.create({ url: danawaUrl });
    }
  } catch (error) {
    console.error("최저가 검색기 실행 오류:", error);
  }
});
