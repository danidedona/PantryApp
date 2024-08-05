import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  AppBar,
  Toolbar,
} from "@mui/material";
import { firestore } from "@/app/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { removeLoginCookie } from "./../Utils/cookie";
import Image from "next/image";
import logo from "../Images/ThePantry.png";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

const NavBar = ({ user, handleSignOut }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#123456" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center">
          <Image
            src={logo}
            alt="Logo"
            width={50}
            height={50}
            style={{ objectFit: "contain" }}
          />
          <Typography variant="h6" sx={{ marginLeft: 2 }}>
            {user.name} {/* Display user name */}
          </Typography>
        </Box>
        <Button color="inherit" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default function Home({ user, setAuthing }) {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [userName, setUserName] = useState(""); // Initialize userName

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateInventory = async () => {
    if (user) {
      const snapshot = query(
        collection(firestore, "users", user.uid, "inventory")
      );
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({ name: doc.id, ...doc.data() });
      });
      setInventory(inventoryList);
    }
  };

  useEffect(() => {
    updateInventory();
  }, [user]);

  const fetchUserName = async () => {
    if (user && user.uid) {
      console.log("Fetching user with UID:", user.uid);
      try {
        const userDoc = doc(firestore, "users", user.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          console.log("User data:", userSnapshot.data()); // Check data
          const userData = userSnapshot.data();
          console.log("userData:", userData);
          setUserName(userData.name);
        } else {
          console.log("No document found for UID:", user.uid);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    } else {
      console.log("User or UID is not available.");
    }
  };

  useEffect(() => {
    console.log("User object:", user); // Check if user.uid is valid
    fetchUserName();
  }, [user]);

  useEffect(() => {
    // Filter inventory based on search query
    if (searchQuery === "") {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(
        inventory.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, inventory]);

  const addItem = async (item) => {
    const docRef = doc(
      collection(firestore, "users", user.uid, "inventory"),
      item
    );
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(
      collection(firestore, "users", user.uid, "inventory"),
      item
    );
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleSignOut = () => {
    removeLoginCookie();
    setAuthing(0);
  };

  return (
    <Box width="100vw" height="100vh">
      <NavBar user={{ name: userName }} handleSignOut={handleSignOut} />
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        gap={2}
        marginTop="64px" // Adjust this value based on the height of your NavBar
      >
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction={"row"} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  setItemName("");
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button variant="contained" onClick={handleOpen}>
          Add New Item
        </Button>
        <Box border={"1px solid #333"}>
          <Box
            width="800px"
            height="100px"
            bgcolor={"#123456"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography variant={"h2"} color={"#ffffff"} textAlign={"center"}>
              Inventory Items
            </Typography>
          </Box>
          <Stack width="800px" height="400px" spacing={2} overflow={"auto"}>
            {filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="100px"
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                bgcolor={"#f0f0f0"}
                paddingX={5}
              >
                <Typography variant={"h3"} color={"#333"} textAlign={"center"}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={"h3"} color={"#333"} textAlign={"center"}>
                  Quantity: {quantity}
                </Typography>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Box>
            ))}
          </Stack>
          <TextField
            id="search-bar"
            label="Search Items"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: "800px" }}
          />
        </Box>
      </Box>
    </Box>
  );
}
