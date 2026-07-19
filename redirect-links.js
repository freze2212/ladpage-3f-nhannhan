/* Apply window.REDIRECT_URL (from config.js) to all .redirect-link anchor elements.
 * Mini-game: Coin Flip — CSS rotateY animation, always lands on heads, then redirect CTA.
 */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var url = window.REDIRECT_URL || '#';

    /* --- Wire all redirect links --- */
    var links = document.querySelectorAll('a.redirect-link');
    for (var i = 0; i < links.length; i++) {
      links[i].href = url;
    }

    /* --- Element refs --- */
    var mainCta     = document.getElementById('main-cta');
    var modal       = document.getElementById('casino-modal');
    var coin        = document.getElementById('coin');
    var modalMsg    = document.getElementById('modal-message');
    var flipBtn     = document.getElementById('flip-btn');
    var finalCta    = document.getElementById('final-cta');
    var modalTitle  = document.getElementById('modal-title');

    /* Guard: if any critical element is missing, abort gracefully */
    if (!mainCta || !modal || !coin || !flipBtn || !finalCta) return;

    /* --- State --- */
    var hasFlipped = false;

    /* Open modal on main CTA click */
    mainCta.addEventListener('click', function (e) {
      e.preventDefault();
      resetModal();
      modal.style.display = 'flex';
    });

    /* Coin flip trigger */
    flipBtn.addEventListener('click', function () {
      if (hasFlipped) return;
      hasFlipped = true;

      /* Disable button during animation */
      flipBtn.disabled = true;
      modalMsg.textContent = 'Đồng xu đang tung...';
      modalMsg.classList.remove('success-text');

      /* Trigger CSS keyframe animation by adding class */
      coin.classList.add('flipping');

      /*
       * Animation duration matches CSS: 2.4s (coinFlip keyframe).
       * After completion, coin is at rotateY(1800deg) = 5 full rotations = heads.
       */
      var FLIP_DURATION_MS = 2400;

      setTimeout(function () {
        /* Show win state */
        modalTitle.textContent = 'CHÚC MỪNG!';
        modalMsg.textContent = 'Chúc mừng! Bạn thắng — tỉ lệ nhận thưởng đã được kích hoạt!';
        modalMsg.classList.add('success-text');

        /* Show final CTA, hide flip button */
        flipBtn.classList.add('hidden');
        finalCta.classList.remove('hidden');
        finalCta.textContent = 'Nhận Thưởng & Chơi Ngay';
      }, FLIP_DURATION_MS);
    });

    /* Final CTA redirects to destination */
    finalCta.addEventListener('click', function () {
      window.location.href = url;
    });

    /* Close modal when clicking outside modal-content */
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

    /* --- Helpers --- */
    function resetModal() {
      hasFlipped = false;

      /* Reset coin to initial position without animation */
      coin.classList.remove('flipping');

      /*
       * Force reflow so removing the class takes effect before the next paint.
       * This prevents the browser from batching the class removal with any
       * subsequent class addition, ensuring the animation restarts cleanly.
       */
      void coin.offsetWidth; /* eslint-disable-line no-void */

      modalTitle.textContent = 'TUNG ĐỒNG XU MAY MẮN';
      modalMsg.textContent = 'Nhấn nút để tung đồng xu...';
      modalMsg.classList.remove('success-text');

      flipBtn.disabled = false;
      flipBtn.classList.remove('hidden');
      finalCta.classList.add('hidden');
    }
  });
})();
