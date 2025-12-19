import propType from "prop-types";
import {RupeeSymbol} from "../../layouts/layouts"

const OrdersInfoContainer = ({
  trStyle,
  tdStyle,
  OrderslideCount,
  products,
  amount,
}) => {
  // Safety check and get current product
  const currentProduct =
    products && products.length
      ? products[OrderslideCount] || products[0]
      : null;

  if (!currentProduct) return null;

  return (
    <div className="flex justify-center w-full bg-gray-300 mt-5 rounded-lg px-4 shirnk-0">
      <table className="w-full border-collapse">
        <tbody>
          <tr className={trStyle}>
            <td>Name</td>
            <td className={tdStyle}>
              <strong>{currentProduct.name}</strong>
            </td>
          </tr>
          {/* <tr className={trStyle}>
            <td>Price</td>
            <td className={tdStyle}>
              <strong>{<RupeeSymbol/>}{currentProduct.price}</strong>
            </td>
          </tr> */}
          <tr className={trStyle}>
            <td>Qty</td>
            <td className={tdStyle}>
              <strong>{currentProduct.quantity}</strong>
            </td>
          </tr>
          <tr className={trStyle}>
            <td>Item Qty cost</td>
            <td className={tdStyle}>
              <strong>{<RupeeSymbol/>}{(Number(currentProduct.itemQtyCost).toFixed(2))}</strong>
            </td>
          </tr>
          <tr className={trStyle}>
            <td>Final price</td>
            <td className={tdStyle}>
              <strong>{<RupeeSymbol/>}{amount}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

OrdersInfoContainer.propTypes = {
  trStyle: propType.string,
  tdStyle: propType.string,
  OrderslideCount: propType.number,
  products: propType.array,
  amount: propType.oneOfType([propType.string, propType.number]),
};

export default OrdersInfoContainer;
