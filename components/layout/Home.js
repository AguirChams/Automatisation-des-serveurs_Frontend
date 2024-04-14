import "./Home.scss";
import { FaBehance, FaDribbble } from "react-icons/fa";
import {
  IoMailOutline,
  IoLogInOutline,
  IoChevronForwardCircle,
  IoStar,
} from "react-icons/io5";
import { IconContext } from "react-icons";
import Card from "../Card";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
} from "antd";
import Footer from "./Footer";
import { motion } from "framer-motion";
import Link from "antd/es/typography/Link";

let easeing = [0.6, -0.05, 0.01, 0.99];

const stagger = {
  animate: {
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.2,
      staggerDirection: 1,
    },
  },
};

const fadeInUp = {
  initial: {
    y: -60,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: easeing,
    },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      delay: 0.5,
      ease: easeing,
    },
  },
};

const transition = { duration: 1.4, ease: [0.6, 0.01, -0.05, 0.9] };

const firstName = {
  initial: {
    y: -20,
  },
  animate: {
    y: 0,
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

const lastName = {
  initial: {
    y: -20,
  },
  animate: {
    y: 0,
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.04,
      staggerDirection: 1,
    },
  },
};

const letter = {
  initial: {
    y: 400,
  },
  animate: {
    y: 0,
    transition: { duration: 1, ...transition },
  },
};

const btnGroup = {
  initial: {
    y: -60,
    opacity: 0,
    transition: { duration: 0.6, ease: easeing },
  },
  animate: {
    y: 0,
    opacity: 1,
    animation: {
      duration: 0.6,
      ease: easeing,
    },
  },
};
const star = {
  initial: {
    y: 60,
    opacity: 0,
    transition: { duration: 0.8, ease: easeing },
  },
  animate: {
    y: 0,
    opacity: 1,
    animation: {
      duration: 0.6,
      ease: easeing,
    },
  },
};

const header = {
  initial: {
    y: -60,
    opacity: 0,
    transition: { duration: 0.05, ease: easeing },
  },
  animate: {
    y: 0,
    opacity: 1,
    animation: {
      duration: 0.6,
      ease: easeing,
    },
  },
};

function Home() {
  return (
    <motion.div initial="initial" animate="animate">
      <motion.header variants={stagger}>
      <motion.div className="logo_wrapper" variants={header} style={{ display: "flex", alignItems: "center" }}>
  <img
    src="https://media.licdn.com/dms/image/C4D0BAQEx4wQN8NGYTA/company-logo_200_200/0/1674053392733?e=2147483647&v=beta&t=PiVEhBEBF--iBNaHT8MAY9NvFXwGDuk08yAJ6aE1c0M"
    alt=""
    style={{ width: "50px", height: "50px", marginRight: "5px" }}
  />
  <span style={{ verticalAlign: "middle" }}>Mobe<span>lite</span></span>
</motion.div>

        <motion.div className="menu_container" variants={stagger}>
          <motion.span variants={header}>
            <IconContext.Provider
              value={{
                color: "#000",
                size: "18px",
                className: "icons_container",
              }}
            ></IconContext.Provider>
          </motion.span>
          <motion.span variants={header}>
            <Link href="/login">
              <IconContext.Provider value={{ color: "#000", size: "18px" }}>
                <div className="icon">
                  <IoLogInOutline />
                </div>
                Login
              </IconContext.Provider>
            </Link>
          </motion.span>
        </motion.div>
      </motion.header>

      <motion.div
        className="content_wrapper"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: easeing }}
      >
        <div className="left_content_wrapper">
          <motion.h2>
            <motion.span
              variants={firstName}
              initial="initial"
              animate="animate"
              className="first"
            >
              <motion.span variants={letter}>A</motion.span>
              <motion.span variants={letter}>n</motion.span>
              <motion.span variants={letter}>s</motion.span>
              <motion.span variants={letter}>i</motion.span>
              <motion.span variants={letter}>b</motion.span>
              <motion.span variants={letter}>l</motion.span>
              <motion.span variants={letter}>e</motion.span>
              <motion.span variants={letter} className="second"></motion.span>
              <motion.span variants={letter}>E</motion.span>
              <motion.span variants={letter}>v</motion.span>
              <motion.span variants={letter}>e</motion.span>
              <motion.span variants={letter}>r</motion.span>
              <motion.span variants={letter}>y</motion.span>
              <motion.span variants={letter}>t</motion.span>
              <motion.span variants={letter}>h</motion.span>
              <motion.span variants={letter}>i</motion.span>
              <motion.span variants={letter}>n</motion.span>
              <motion.span variants={letter}>g</motion.span>
            </motion.span>
          </motion.h2>

          <motion.p variants={fadeInUp}>
            Simplify your IT team's server management with Ansible Everything.
            Our platform provides a reliable and secure interface for managing
            hundreds of servers, all based on the powerful tool, Ansible.
          </motion.p>

          <motion.div className="review_container" variants={stagger}>
            <motion.p className="total_review" variants={star}>
              99% Customer Satisfaction
            </motion.p>
            <IconContext.Provider value={{ color: "#fff", size: "18px" }}>
              <motion.span
                variants={star}
                whileHover={{
                  scale: 1.2,
                  rotate: 180,
                  borderRadius: "100%",
                  cursor: "pointer",
                }}
              >
                <IoStar />
              </motion.span>
              <motion.span
                variants={star}
                whileHover={{
                  scale: 1.2,
                  rotate: 180,
                  borderRadius: "100%",
                  cursor: "pointer",
                }}
              >
                <IoStar />
              </motion.span>
              <motion.span
                variants={star}
                whileHover={{
                  scale: 1.2,
                  rotate: 180,
                  borderRadius: "100%",
                  cursor: "pointer",
                }}
              >
                <IoStar />
              </motion.span>
            </IconContext.Provider>
            <motion.p className="review_text" variants={fadeInUp}>
              {" "}
              "I've been using ansible everything and since then my company
              servers working fine"{" "}
            </motion.p>{" "}
          </motion.div>
        </div>

        <motion.div className="right_content_wrapper">
          <motion.img
            src="https://www.soluxan.com/wp-content/uploads/2019/10/01.jpg"
            alt="bg"
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          />
        </motion.div>
      </motion.div>

      <Card />
      <Footer />
    </motion.div>
  );
}

export default Home;