import React from 'react';
import './Table.css';
import numeral from 'numeral';

const Table = ({countries}) => {
  return (
    <div className="table">
      {countries.map(({ country, cases }) => (
        <tr>
          {console.log(country._id)}
          <td className="table__country">{country}</td>
          <td className="table__cases">
            {numeral(cases).format('0,0')}
          </td>
        </tr>
      ))}
    </div>
  );
};

export default Table;
