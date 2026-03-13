import { useState, useEffect } from 'react';
import UserForm from '../components/UserForm';
import UserTable from '../components/UserTable';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../services/userService';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [lookupId, setLookupId] = useState('');
  const [lookedUpUser, setLookedUpUser] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const isDev = import.meta.env.DEV;
  const usersEndpoint = isDev
    ? '/api/users (proxy -> https://da2-sever-nodejs.onrender.com/users)'
    : `${import.meta.env.VITE_API_BASE_URL}/users`;

  const toErrorMessage = (err, fallback) => err?.message || fallback;

  const runAction = async (action, { successMessage, keepFeedback = false } = {}) => {
    setBusy(true);

    try {
      await action();

      if (successMessage) {
        setFeedback({ type: 'success', message: successMessage });
      } else if (!keepFeedback) {
        setFeedback(null);
      }
      return true;
    } catch (err) {
      console.error(err);
      setFeedback({
        type: 'danger',
        message: toErrorMessage(err, 'Có lỗi xảy ra khi gọi API'),
      });
      return false;
    } finally {
      setBusy(false);
    }
  };

  const loadUsers = async () => {
    setLoadingList(true);
    const ok = await runAction(async () => {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    }, { keepFeedback: true });
    setLoadingList(false);
    return ok;
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSave = async (name, id) => {
    const successMessage = id
      ? `Cập nhật user #${id} thành công.`
      : 'Tạo user thành công.';

    return runAction(async () => {
      if (id) {
        await updateUser(id, name);
      } else {
        await createUser(name);
      }

      setEditingUser(null);
      await loadUsers();
    }, { successMessage });
  };

  const handleCreateSampleUser = async () => {
    const sampleName = `Sample User 1 - ${new Date().toLocaleString('sv-SE').replace(' ', '_')}`;

    await runAction(async () => {
      await createUser(sampleName);
      await loadUsers();
    }, {
      successMessage: `Đã gửi tạo user mẫu: ${sampleName}`,
    });
  };

  const handleGetById = async () => {
    const normalizedId = Number(lookupId);

    if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
      setFeedback({
        type: 'warning',
        message: 'Vui lòng nhập ID hợp lệ (số nguyên dương).',
      });
      setLookedUpUser(null);
      return;
    }

    await runAction(async () => {
      const user = await getUserById(normalizedId);
      setLookedUpUser(user);
    }, {
      successMessage: 'Đã tìm thấy người dùng.',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa User này không?')) {
      await runAction(async () => {
        await deleteUser(id);
        await loadUsers();
      }, {
        successMessage: `Đã xóa user #${id}.`,
      });
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-2 text-primary">Quản lý người dùng</h2>
      <p className="text-muted mb-4">
        Kết nối máy chủ: <strong>{usersEndpoint}</strong>
      </p>

      <div className="d-flex gap-2 flex-wrap mb-3">
        <button
          className="btn btn-outline-primary"
          onClick={loadUsers}
          disabled={busy || loadingList}
        >
          Tải lại danh sách
        </button>
        {(busy || loadingList) && <span className="badge text-bg-secondary p-2">Đang gọi API...</span>}
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type}`} role="alert">
          {feedback.message}
        </div>
      )}

      <UserForm
        editingUser={editingUser}
        onSave={handleSave}
        onCancel={() => setEditingUser(null)}
        onCreateSample={handleCreateSampleUser}
        busy={busy || loadingList}
      />

      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text">ID</span>
            <input
              type="number"
              min="1"
              className="form-control"
              placeholder="Nhập ID người dùng..."
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              disabled={busy || loadingList}
            />
            <button
              className="btn btn-outline-dark"
              onClick={handleGetById}
              disabled={busy || loadingList}
            >
              Tìm kiếm
            </button>
          </div>
        </div>
        <div className="col-md-4">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => {
              setLookedUpUser(null);
              setLookupId('');
            }}
            disabled={busy || loadingList}
          >
            Xóa kết quả
          </button>
        </div>
      </div>

      {lookedUpUser && (
        <div className="alert alert-info d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>
            Kết quả: <strong>{lookedUpUser.name}</strong>
          </span>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setEditingUser(lookedUpUser)}
            disabled={busy || loadingList}
          >
            Chỉnh sửa
          </button>
        </div>
      )}

      {loadingList ? (
        <p className="text-center">Đang tải dữ liệu...</p>
      ) : (
        <UserTable
          users={users}
          onEdit={setEditingUser}
          onDelete={handleDelete}
          busy={busy || loadingList}
        />
      )}
    </div>
  );
}

export default UsersPage;
