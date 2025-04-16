
import React, { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

  
  const HomePage = () => {

    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [openIndexes, setOpenIndexes] = useState([]);
  
    const getData = useCallback(async () => {
      const { data, error } = await supabase
        .from('studyguides') // Ensure the table name is correct
        .select('text') // Ensure the column name is correct
        .order('id');
  
      if (error) {
        setError("Fetch error: " + error.message);
      } else {
        setData(data || []);
      }
    }, [supabase]);
  
    useEffect(() => {
      getData();
    }, [getData]);
  
    const toggleDropdown = (index) => {
      setOpenIndexes((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    };
  
    return (
      <div className="home-page" style={{ padding: '1rem' }}>
        <h1>These are your study guides</h1>
  
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {data.length === 0 && !error && <div>Loading...</div>}
  
        {data.map((item, index) => {
          const lines = item.text?.split('\n') || []; 
          const title = lines[0] || ''; 
          const body = lines.slice(1).join('\n'); 
  
          return (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <button
                onClick={() => toggleDropdown(index)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.5rem',
                  fontWeight: 'bold',
                  backgroundColor: '#eee',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              >
                {title}
              </button>
              {openIndexes.includes(index) && (
                <div
                  style={{
                    backgroundColor: '#282c34',
                    border: '1px solid #ddd',
                    borderTop: 'none',
                    padding: '0.5rem',
                    whiteSpace: 'pre-line',
                    color: '#fff',
                  }}
                >
                  {body}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  export default HomePage;