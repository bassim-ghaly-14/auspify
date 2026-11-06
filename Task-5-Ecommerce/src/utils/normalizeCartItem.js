/**
 * Normalize a Route API v2 cart item into a predictable frontend shape.
 *
 * Raw API cart item (GET /api/v2/cart  ->  data.products[]):
 *   {
 *     _id: "<cart item id>",          // stable id for this cart line (React key)
 *     count: <number>,                 // cart quantity
 *     price: <number>,                 // effective unit price charged for the line
 *     product: {
 *       _id: "<product id>",
 *       title: "...",
 *       imageCover: "...",             // absolute image URL
 *       price: <number>,
 *       priceAfterDiscount?: <number>,
 *       category: {...},
 *       brand: {...}
 *     }
 *   }
 *
 * Frontend normalized shape (consumed by Cart, Cart Drawer and Checkout):
 *   {
 *     _id: "<cart item id>",
 *     productId: "<product id>",       // product links + /api/v2/cart/:id
 *     title: "...",
 *     imageCover: "...",
 *     price: <number>,                 // effective unit price
 *     quantity: <number>,              // cart quantity
 *     category: {...},
 *     brand: {...}
 *   }
 *
 * Only values actually returned by the API are used. Defensive fallbacks
 * keep the shape stable even if a field is missing, without fabricating data.
 */
export const normalizeCartItem = (item) => {
  if (!item) return null

  const product = item.product ?? {}
  // The cart item's own `price` is the effective unit price used for the line
  // total (totalCartPrice = sum(price * count)). Fall back to the product's
  // discounted/original price only when the cart item omits it.
  const price = item.price ?? product.priceAfterDiscount ?? product.price ?? 0
  const quantity = item.count ?? item.quantity ?? 1

  return {
    _id: item._id,
    productId: product._id ?? item.productId,
    title: product.title ?? item.title,
    imageCover: product.imageCover ?? item.imageCover,
    price: Number(price) || 0,
    quantity: Number.isInteger(quantity) ? quantity : 1,
    category: product.category,
    brand: product.brand,
  }
}

export const normalizeCartItems = (items = []) =>
  Array.isArray(items) ? items.map(normalizeCartItem).filter(Boolean) : []
