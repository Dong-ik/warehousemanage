import "./itemList.css";

export const ItemList = () => {
  return (
    <div>
      <h2>Item List Page</h2>
      <table>
        <thead>
          <tr>
            <th>물품번호</th>
            <th>물품이름</th>
            <th>수량</th>
            <th>보관창고</th>
            <th>보관위치</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>001</td>
            <td>노트북</td>
            <td>10</td>
            <td>창고 A</td>
            <td>선반 3</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
