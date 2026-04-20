const TimeSlotTable = ({ timeSlots, onDelete }) => {
  return (
    <table className="table table-hover m-0">
      <thead>
        <tr>
          <th>#</th>
          <th>Giờ bắt đầu</th>
          <th>Giờ kết thúc</th>
          <th>Hành động</th>
        </tr>
      </thead>

      <tbody>
        {timeSlots.map((t, index) => (
          <tr key={t.id}>
            <td>{index + 1}</td>
            <td>{t.start}</td>
            <td>{t.end}</td>
            <td>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(t.id)}
              >
                Xóa
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TimeSlotTable;