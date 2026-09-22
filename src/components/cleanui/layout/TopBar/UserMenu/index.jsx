import React, { useState } from "react";
import { connect } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Avatar } from "antd";
import styles from "./style.module.scss";

const mapStateToProps = ({ user }) => ({ user });

const ProfileMenu = ({ dispatch, user }) => {
  const [count, setCount] = useState(7);

  const logout = (e) => {
    e.preventDefault();
    dispatch({ type: "user/LOGOUT" });
  };

  const addCount = () => {
    setCount((prev) => prev + 1);
  };

  // ✅ AntD v5 Menu items
  const menuItems = [
    {
      key: "info",
      label: (
        <div>
          <strong>{user.name || "Anonymous"}</strong>
          <div>{user.role || "—"}</div>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "contact",
      label: (
        <div>
          {user.email || "—"}
          <br />
          {user.phone || "—"}
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "logout",
      label: (
        <a href="#" onClick={logout}>
          <i className="fe fe-log-out me-2" />
          Logout
        </a>
      ),
    },
  ];

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      onOpenChange={addCount}   // ✅ v5
      popupRender={() => (
        <Menu selectable={false} items={menuItems} />
      )}
    >
      <div className={styles.dropdown}>
        <Avatar
          className={styles.avatar}
          shape="square"
          size="large"
          icon={<UserOutlined />}
        />
      </div>
    </Dropdown>
  );
};

export default connect(mapStateToProps)(ProfileMenu);
