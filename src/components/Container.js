import React from 'react';

export const Container = ({config, formik}) => {
  const builder = (individualConfig) => {
    switch (individualConfig.type) {
      case 'text':
        return (
                <>
                <div>
                  <label htmlFor={individualConfig.field}>{individualConfig.label}</label>
                  <input type='text' 
                    name={individualConfig.field} 
                    onChange={formik.handleChange} 
                    style={{...individualConfig.style}}
                    value={formik.values[individualConfig.field] || ''}
                     />
                  </div>
                </>
              );
      default:
        return <div>Unsupported field</div>
    }
  }

  return (
    <>
      {config.map((c) => {
        return builder(c);
      })}
    </>
  );
};