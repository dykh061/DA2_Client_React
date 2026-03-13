import { useState, useEffect } from 'react';

function UserForm({ editingUser, onSave, onCancel, onCreateSample, busy }) {
  const [name, setName] = useState('');

  useEffect(() => {
    setName(editingUser ? editingUser.name : '');
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.trim() === '') {
      alert('Vui lòng nhập tên!');
      return;
    }

    await onSave(name.trim(), editingUser?.id);

    if (!editingUser) {
      setName('');
    }
  };

  return (
    <form className="row mb-4 bg-light p-3 border rounded g-2" onSubmit={handleSubmit}>
      <div className="col-md-7">
        <input
          type="text"
          className="form-control"
          placeholder="Nhập tên người dùng..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={busy}
        />
      </div>
      <div className="col-md-5 d-flex align-items-center gap-2 flex-wrap">
        <button
          type="submit"
          className={`btn ${editingUser ? 'btn-primary' : 'btn-success'}`}
          disabled={busy}
        >
          {editingUser ? 'Cập nhật' : 'Thêm người dùng'}
        </button>
        {!editingUser && (
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={onCreateSample}
            disabled={busy}
          >
            Tạo mẫu
          </button>
        )}
        {editingUser && (
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={busy}>
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}

export default UserForm;
