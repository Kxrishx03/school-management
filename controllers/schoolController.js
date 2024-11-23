const pool = require("../db"); 

// ADD A NEW SCHOOL
const addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).send({ error: "All fields are required!" });
  }

  try {
    const query = `
      INSERT INTO schools (name, address, latitude, longitude)
      VALUES (?, ?, ?, ?)
    `;
    await pool.query(query, [name, address, latitude, longitude]);
    res.status(201).send({ message: "School added successfully!" });
  } catch (error) {
    console.error("Error adding school:", error);
    res.status(500).send({ error: "Failed to add school." });
  }
};

//LIST SCHOOLS
const listSchools = async (req, res) => {
    const { latitude, longitude } = req.query;
  
    if (!latitude || !longitude) {
      return res.status(400).send({ error: "Latitude and longitude are required!" });
    }
  
    const haversineDistance = (lat1, lon1, lat2, lon2) => {
      const toRadians = (degrees) => (degrees * Math.PI) / 180;
  
      const R = 6371; 
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);
  
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
  
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; 
    };
  
    try {
      const [schools] = await pool.query("SELECT * FROM schools");
  
      const sortedSchools = schools
        .map((school) => {
          const distance = haversineDistance(
            parseFloat(latitude),
            parseFloat(longitude),
            school.latitude,
            school.longitude
          );
          return { ...school, distance };
        })
        .sort((a, b) => a.distance - b.distance); // Sort by distance
  
      res.send(sortedSchools);
    } catch (error) {
      console.error("Error listing schools:", error);
      res.status(500).send({ error: "Failed to fetch schools." });
    }
  };

  
module.exports = {
    addSchool,
    listSchools,
  };
  