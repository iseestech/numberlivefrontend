

import { Dropdown } from "antd";
// import List2 from '@/components/kit/widgets/Lists/2'
import styles from "./style.module.scss";
const Actions = () => {
  const dropdownContent = () => (
    <div className="card cui__utils__shadow width-350 border-0">
      <div className="card-body p-0">
        {/* <List2 /> */}
        List Demo
      </div>
    </div>
  );

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      popupRender={dropdownContent}
    >
      <div className={styles.dropdown}>
        <i className={`${styles.icon} fe fe-bell`} />
      </div>
    </Dropdown>
  );
};

export default Actions;