if (!customElements.get('quick-add-modal')) {
  customElements.define(
    'quick-add-modal',
    class QuickAddModal extends ModalDialog {
      constructor() {
        super();
        this.modalContent = this.querySelector('[id^="QuickAddInfo-"]');

        this.addEventListener('product-info:loaded', ({ target }) => {
          target.addPreProcessCallback(this.preprocessHTML.bind(this));
        });
      }

      hide(preventFocus = false) {
        const cartNotification = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        if (cartNotification) cartNotification.setActiveElement(this.openedBy);
        this.modalContent.innerHTML = '';

        if (preventFocus) this.openedBy = null;
        super.hide();
      }

      show(opener) {
        opener.setAttribute('aria-disabled', true);
        opener.classList.add('loading');
        opener.querySelector('.loading__spinner').classList.remove('hidden');

        fetch(opener.getAttribute('data-product-url'))
          .then((response) => response.text())
          .then((responseText) => {
            const responseHTML = new DOMParser().parseFromString(responseText, 'text/html');
            const productElement = responseHTML.querySelector('product-info');

            this.preprocessHTML(productElement);
            HTMLUpdateUtility.setInnerHTML(this.modalContent, productElement.outerHTML);

            if (window.Shopify && Shopify.PaymentButton) {
              Shopify.PaymentButton.init();
            }
            if (window.ProductModel) window.ProductModel.loadShopifyXR();

            super.show(opener);
          })
          .finally(() => {
            opener.removeAttribute('aria-disabled');
            opener.classList.remove('loading');
            opener.querySelector('.loading__spinner').classList.add('hidden');
          });
      }

      preprocessHTML(productElement) {
        this.preventDuplicatedIDs(productElement);
        this.removeDOMElements(productElement);
        this.preventVariantURLSwitching(productElement);
      }

      preventVariantURLSwitching(productElement) {
        productElement.setAttribute('data-update-url', 'false');
      }

      removeDOMElements(productElement) {
        const pickupAvailability = productElement.querySelector('pickup-availability');
        if (pickupAvailability) pickupAvailability.remove();

        const productModal = productElement.querySelector('product-modal');
        if (productModal) productModal.remove();

        const productPopup = productElement.querySelector('.product-popup-modal__opener');
        if (productPopup) productPopup.remove();

        const modalDialog = productElement.querySelectorAll('modal-dialog');
        if (modalDialog) modalDialog.forEach((modal) => modal.remove());

        const hTitle = productElement.querySelectorAll('h1');
        if (hTitle) hTitle.forEach(modal => modal.remove());

        const Accordion = productElement.querySelectorAll('.accordion');
        if (Accordion) Accordion.forEach(modal => modal.remove());

        const ProductDescription = productElement.querySelectorAll('.product-description-static');
        if (ProductDescription) ProductDescription.forEach(modal => modal.remove());

        const ProductDescriptionExpandButton = productElement.querySelectorAll('.product-text-clamp-toggle');
        if (ProductDescriptionExpandButton) ProductDescriptionExpandButton.forEach(modal => modal.remove());      
        
        const ProductTabs = productElement.querySelectorAll('.product-info-tabs');
        if (ProductTabs) ProductTabs.forEach(modal => modal.remove());

        const ProductBreadcrumb = productElement.querySelectorAll('.product-breadcrumb-block');
        if (ProductBreadcrumb) ProductBreadcrumb.forEach(modal => modal.remove());

        const SiblingProductSelectors = productElement.querySelectorAll('.product__cross-links');
        if (SiblingProductSelectors) SiblingProductSelectors.forEach(modal => modal.remove());      

        const SocialLinks = productElement.querySelectorAll('.product-share-component');
        if (SocialLinks) SocialLinks.forEach(modal => modal.remove());

        const ProductBadges = productElement.querySelectorAll('.main-product--badge');
        if (ProductBadges) ProductBadges.forEach(modal => modal.remove());       
        
        const ProductIcons = productElement.querySelectorAll('.product-feature-icon-grid--wrapper');
        if (ProductIcons) ProductIcons.forEach(modal => modal.remove());

        const ProductFeatureList = productElement.querySelectorAll('.product__feature-checklist');
        if (ProductFeatureList) ProductFeatureList.forEach(modal => modal.remove());        
        
        const ProductImgBlocks = productElement.querySelectorAll('.product__inset_image_block');
        if (ProductImgBlocks) ProductImgBlocks.forEach(modal => modal.remove()); 

      }

      preventDuplicatedIDs(productElement) {
        const sectionId = productElement.dataset.section;

        const oldId = sectionId;
        const newId = `quickadd-${sectionId}`;
        productElement.innerHTML = productElement.innerHTML.replaceAll(oldId, newId);
        Array.from(productElement.attributes).forEach((attribute) => {
          if (attribute.value.includes(oldId)) {
            productElement.setAttribute(attribute.name, attribute.value.replace(oldId, newId));
          }
        });

        productElement.dataset.originalSection = sectionId;
      }

    }
  );
}
