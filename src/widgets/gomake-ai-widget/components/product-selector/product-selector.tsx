import { useEffect, useRef, useState } from "react";
import { useGomakeAxios } from "@/hooks";
import { getALLProductsForGoAiApi } from "@/services/api-service/products/product-endpoints";
import { useIsMobile } from "@/hooks/use-responsive";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useStyle } from "./style";

interface ProductSelectorProps {
  onProductSelect: (productId: string) => Promise<void>;
  isProcessing?: boolean;
}

const ProductSelector = ({
  onProductSelect,
  isProcessing,
}: ProductSelectorProps) => {
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const isMobile = useIsMobile();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setSearchQuery("");
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const callback = (res: any) => {
        if (res.success) {
          const productsData = res?.data || [];
          setProducts(productsData);
          setFilteredProducts(productsData);
        }
      };
      await getALLProductsForGoAiApi(callApi, callback, {});
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsDropdownOpen(false);
    setSearchQuery("");
  };

  const handleRemoveSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProductId(null);
  };

  const handleContinue = async () => {
    if (selectedProductId) {
      await onProductSelect(selectedProductId);
    }
  };

  if (isLoading) {
    return (
      <div style={classes.loadingContainer}>
        <div style={classes.loadingSpinner} />
        <div style={classes.loadingText}>Loading available products...</div>
      </div>
    );
  }

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div style={classes.container}>
      {/* Header */}
      <div style={classes.header}>
        <div
          style={{
            ...classes.headerIcon,
            ...(isMobile ? classes.headerIconMobile : {}),
          }}
        >
          <AutoAwesomeIcon
            style={{
              fontSize: isMobile ? 24 : 30,
              color: "#9333ea",
            }}
          />
        </div>
        <div
          style={{
            ...classes.headerTitle,
            ...(isMobile ? classes.headerTitleMobile : {}),
          }}
        >
          Select Your Product
        </div>
        <div
          style={{
            ...classes.headerSubtitle,
            ...(isMobile ? classes.headerSubtitleMobile : {}),
          }}
        >
          Choose from your existing products to get started with AI-powered
          pricing and customization.
        </div>
      </div>

      {/* Dropdown Container */}
      <div style={classes.dropdownWrapper} ref={dropdownRef}>
        {/* Selected Display / Dropdown Trigger */}
        <div
          onClick={() => !isLoading && setIsDropdownOpen(!isDropdownOpen)}
          className={`product-dropdown-trigger ${isDropdownOpen ? "open" : ""}`}
          style={{
            ...classes.dropdownTrigger,
            ...(isMobile ? classes.dropdownTriggerMobile : {}),
            ...(isDropdownOpen ? classes.dropdownTriggerOpen : {}),
          }}
        >
          <div style={classes.dropdownTriggerText}>
            {selectedProduct ? selectedProduct.name : "Select a product..."}
          </div>
          <div style={classes.dropdownActions}>
            {selectedProduct && (
              <div
                onClick={handleRemoveSelection}
                style={classes.clearButton}
                className="clear-selection-btn"
                title="Clear selection"
              >
                ✕
              </div>
            )}
            <KeyboardArrowDownIcon
              style={{
                ...classes.dropdownArrow,
                ...(isDropdownOpen ? classes.dropdownArrowOpen : {}),
              }}
            />
          </div>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            style={{
              ...classes.dropdownMenu,
              ...(isMobile ? classes.dropdownMenuMobile : {}),
            }}
          >
            {/* Search Input */}
            <div style={classes.dropdownSearch}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  ...classes.dropdownSearchInput,
                  ...(isMobile ? classes.dropdownSearchInputMobile : {}),
                }}
                autoFocus
              />
            </div>

            {/* Products List */}
            <div style={classes.dropdownList} className="product-dropdown-list">
              {filteredProducts.length === 0 ? (
                <div style={classes.dropdownEmpty}>
                  {searchQuery
                    ? "No products found matching your search"
                    : "No products available"}
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    style={{
                      ...classes.dropdownItem,
                      ...(selectedProductId === product.id
                        ? classes.dropdownItemSelected
                        : {}),
                    }}
                    className="dropdown-item"
                  >
                    <div
                      style={{
                        ...classes.dropdownItemName,
                        ...(isMobile ? classes.dropdownItemNameMobile : {}),
                      }}
                    >
                      {product.name}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Continue Button */}
      {selectedProductId && (
        <div style={classes.continueButtonContainer}>
          <button
            onClick={handleContinue}
            disabled={isProcessing}
            style={{
              ...classes.continueButton,
              ...(isMobile ? classes.continueButtonMobile : {}),
              ...(isProcessing ? classes.continueButtonDisabled : {}),
            }}
          >
            {isProcessing ? (
              <>
                <div style={classes.buttonSpinner} />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <AutoAwesomeIcon style={classes.continueButtonIcon} />
                <span>Continue with {selectedProduct?.name}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export { ProductSelector };
