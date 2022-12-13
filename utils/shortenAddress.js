import { utils } from "ethers";

const shortenAddress = _address => {
  try {
    const formattedAddress = utils.getAddress(_address);
    return (
      formattedAddress.substring(0, 6) +
      "..." +
      formattedAddress.substring(formattedAddress.length - 4)
    );
  } catch {
    return _address;
  }
}

export default shortenAddress;