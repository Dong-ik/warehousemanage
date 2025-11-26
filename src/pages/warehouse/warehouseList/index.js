import "./wherehouseList.css";

export const WarehouseList = () => {
  return (
    <div>
      <h2>Warehouse List Page</h2>
      <table>
        <thead>
          <tr>
            <th>창고번호</th>
            <th>창고이름</th>
            <th>창고이미지</th>
            <th>창고위치</th>
            <th>창고 관리자</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>WH001</td>
            <td>중앙창고</td>
            <td></td>
            <td>서울특별시 강남구</td>
            <td>홍길동</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
