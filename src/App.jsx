import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClientInstance } from "@/lib/query-client"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import ScrollToTop from "./components/ScrollToTop"
import Home from "@/pages/Home"
import { CartProvider } from "@/lib/CartContext"
import { StoreProvider } from "@/lib/StoreContext"
import StoreLayout from "@/components/fs-pc/store/StoreLayout"
import BoutiqueHome from "@/pages/boutique/BoutiqueHome"
import Browse from "@/pages/boutique/Browse"
import ProductDetail from "@/pages/boutique/ProductDetail"
import Cart from "@/pages/boutique/Cart"
import Checkout from "@/pages/boutique/Checkout"
import OrderConfirmation from "@/pages/boutique/OrderConfirmation"
import About from "@/pages/boutique/About"

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <StoreProvider>
          <ScrollToTop />

          <CartProvider>
            <Routes>
              <Route path="/" element={<Home />} />

              <Route element={<StoreLayout />}>
                <Route path="/boutique" element={<BoutiqueHome />} />
                <Route path="/boutique/produits" element={<Browse />} />
                <Route path="/produit/:id" element={<ProductDetail />} />
                <Route path="/panier" element={<Cart />} />
                <Route path="/commande" element={<Checkout />} />
                <Route path="/confirmation" element={<OrderConfirmation />} />
                <Route path="/apropos" element={<About />} />
              </Route>

              <Route path="*" element={<Home />} />
            </Routes>

            <Toaster />
          </CartProvider>
        </StoreProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App