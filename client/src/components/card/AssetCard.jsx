// AssetCard.jsx
import React from 'react';

const AssetCard = ({ asset }) => {
  const { asset_category } = asset;

  return (
    <div className="bg-white border border-solid border-gray-400 rounded p-4 shadow-lg">
      {asset_category === "Truck" ? (
        <div>
          <h3 className="font-bold text-darkblue text-lg">Truck Name: {asset.asset_name}</h3>
          <hr className="my-4 border-gray-400" />
          <p>Brand: {asset.brand}</p>
          <p>Type: {asset.type}</p>
          <p>Plate Number: {asset.plateNumber}</p>
        </div>
      ) : asset_category === "Trailer" ? (
        <div>
          <h3 className="font-bold text-darkblue text-lg">Trailer Type: {asset.type}</h3>
          <hr className="my-4 border-gray-400" />
          <p>Measurements: {asset.measurements}</p>
          <p>Weight: {asset.weight}</p>
          <p>Plate Number: {asset.plateNumber}</p>
        </div>
      ) : (
        <div>Unknown Asset Category</div>
      )}
    </div>
  );
};

export default AssetCard;
