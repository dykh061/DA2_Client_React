function UserTable({ users, onEdit, onDelete, busy }) {
  return (
    <table className="table table-bordered table-striped table-hover">
      <thead>
        <tr>
          <th width="10%">ID</th>
          <th width="50%">Tên</th>
          <th colSpan={2} width="40%">Thao tác</th>
        </tr>
      </thead>
      <tbody className="table-group-divider">
        {users.length === 0 ? (
          <tr>
            <td colSpan={4} className="text-center">
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onEdit(user)}
                  disabled={busy}
                  title="Chỉnh sửa"
                  aria-label={`Chỉnh sửa ${user.name}`}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(user.id)}
                  disabled={busy}
                  title="Xóa"
                  aria-label={`Xóa ${user.name}`}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default UserTable;
