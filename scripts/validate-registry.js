const fs = require('fs');
const path = require('path');

function validateRegistry() {
  console.log('🔍 Validating registry...');
  
  // Check if registry.json exists
  if (!fs.existsSync('./registry.json')) {
    console.error('❌ registry.json not found');
    process.exit(1);
  }
  
  // Parse registry
  const registry = JSON.parse(fs.readFileSync('./registry.json', 'utf8'));
  
  // Check if public/r directory exists
  if (!fs.existsSync('./public/r')) {
    console.error('❌ public/r directory not found. Run build first.');
    process.exit(1);
  }
  
  let errors = 0;
  
  // Validate each component
  registry.items.forEach(item => {
    console.log(`📦 Checking ${item.name}...`);
    
    // Check if JSON file was generated
    const jsonPath = `./public/r/${item.name}.json`;
    if (!fs.existsSync(jsonPath)) {
      console.error(`❌ Generated file missing: ${jsonPath}`);
      errors++;
      return;
    }
    
    // Validate JSON structure
    try {
      const componentJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      
      if (!componentJson.name) {
        console.error(`❌ ${item.name}: Missing name property`);
        errors++;
      }
      
      if (!componentJson.files || !Array.isArray(componentJson.files)) {
        console.error(`❌ ${item.name}: Missing or invalid files array`);
        errors++;
      }
      
      // Check if source files exist
      item.files.forEach(file => {
        if (!fs.existsSync(file.path)) {
          console.error(`❌ ${item.name}: Source file missing: ${file.path}`);
          errors++;
        }
      });
      
    } catch (e) {
      console.error(`❌ ${item.name}: Invalid JSON: ${e.message}`);
      errors++;
    }
  });
  
  if (errors === 0) {
    console.log('✅ All components validated successfully!');
    console.log(`📊 Registry contains ${registry.items.length} components`);
  } else {
    console.error(`❌ Validation failed with ${errors} errors`);
    process.exit(1);
  }
}

validateRegistry();