const getNicDetails = (nic) => {
  let year, days, gender;

  // Validate NIC format
  if ((typeof nic !== 'string' && typeof nic !== 'number') || (nic.length !== 10 && nic.length !== 13)) {
    console.warn(`Invalid NIC format: ${nic}`);
    return null;
  }

  // Extract year and days based on NIC length
  if (nic.length === 10) {
    const lastChar = nic.charAt(9).toLowerCase();
    if (!['v', 'x'].includes(lastChar) || isNaN(nic.substring(0, 9))) {
      console.warn(`Invalid NIC format for length 10: ${nic}`);
      return null;
    }
    year = `19${nic.substring(0, 2)}`;
    days = parseInt(nic.substring(2, 5));
  } else if (nic.length === 13) {
    if (isNaN(nic)) {
      console.warn(`Invalid NIC format for length 13: ${nic}`);
      return null;
    }
    year = nic.substring(0, 4);
    days = parseInt(nic.substring(4, 7));
  }

  // Determine gender based on days
  gender = days > 500 ? 'Female' : 'Male';
  days = gender === 'Female' ? days - 500 : days;

  // Check if days are within a valid range for a year
  if (days < 1 || days > 366) {
    console.warn(`Invalid day value derived from NIC: ${nic}`);
    return null;
  }

  // Calculate birthDate and age
  const birthDate = new Date(year, 0, days);
  const age = new Date().getFullYear() - birthDate.getFullYear();

  // Ensure that birthDate is valid
  if (isNaN(birthDate.getTime())) {
    console.error(`Invalid birthDate calculated for NIC: ${nic}`);
    return null;
  }

  return {
    nic_number: nic,
    birthday: birthDate.toISOString().split('T')[0],
    age,
    gender
  };
};

module.exports = { getNicDetails };
