const getNicDetails = (nic) => {
    let year, days, gender;
  
    if (nic.length === 10) {
      year = `19${nic.substring(0, 2)}`;
      days = parseInt(nic.substring(2, 5));
      gender = days > 500 ? 'Female' : 'Male';
      days = gender === 'Female' ? days - 500 : days;
    } else if (nic.length === 12) {
      year = nic.substring(0, 4);
      days = parseInt(nic.substring(4, 7));
      gender = days > 500 ? 'Female' : 'Male';
      days = gender === 'Female' ? days - 500 : days;
    } else {
      return null;
    }
  
    const birthDate = new Date(year, 0, days);
    const age = new Date().getFullYear() - birthDate.getFullYear();
  
    return {
      nic_number: nic,
      birthday: birthDate.toISOString().split('T')[0],
      age,
      gender
    };
  };
  
  module.exports = { getNicDetails };
  