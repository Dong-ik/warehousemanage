import "./breakdown.css";

export const Breakdown = () => {
  return (
    <div>
      <h2>재산 입출고관리</h2>
      <table>
        <thead>
          <tr>
            <th>물품번호</th>
            <th>물품이름</th>
            <th>구분</th>
            <th>입고량</th>
            <th>출고량</th>
            <th>재고량</th>
            <th>입출고일시</th>
            <th>근거</th>
            <th>담당자</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>001</td>
            <td>노트북</td>
            <td>입고</td>
            <td>
              <input type="number" />
            </td>
            <td>
              <input type="number" />
            </td>
            <td>10</td>
            <td>2024-11-26</td>
            <td>
              <input type="text" />
            </td>
            <td>홍길동</td>
          </tr>
          <tr>
            <td>002</td>
            <td>모니터</td>
            <td>출고</td>
            <td>
              <input type="number" />
            </td>
            <td>
              <input type="number" />
            </td>
            <td>2</td>
            <td>2024-11-25</td>
            <td>
              <input type="text" />
            </td>
            <td>김영희</td>
          </tr>
        </tbody>
      </table>
      <button type="submit">저장</button>
      <button type="reset">초기화</button>
    </div>
  );
};
