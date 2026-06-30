import fs from 'fs';

let content = fs.readFileSync('rebuild_layouts_correctly.mjs', 'utf8');

// The sloppy replace caused:
// src="https://images.unsplash.com/photo-XXX' onerror="this.src='https://images.unsplash.com/photo-YYY'""
// We can find all of them with a regex:
content = content.replace(/src="https:\/\/images\.unsplash\.com\/photo-[^']*' onerror="this\.src='[^']*'""/g, 
    'src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop"'
);

// We also replace any remaining broken URLs directly:
content = content.replace(/src="https:\/\/images\.unsplash\.com\/photo-1614859324967-bdf31ce86910[^"]*"/g,
    'src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop"'
);
content = content.replace(/src="https:\/\/images\.unsplash\.com\/photo-1598256989800-fea5ce5146f5[^"]*"/g,
    'src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop"'
);
content = content.replace(/src="https:\/\/images\.unsplash\.com\/photo-1532153975070-2e9ab71f1b14[^"]*"/g,
    'src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop"'
);
content = content.replace(/src="https:\/\/images\.unsplash\.com\/photo-1606265752439-1f18756aa5fc[^"]*"/g,
    'src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop"'
);
content = content.replace(/src="https:\/\/images\.unsplash\.com\/photo-1544367567-0f2fcb009e0b[^"]*"/g,
    'src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop"'
);
content = content.replace(/src="https:\/\/images\.unsplash\.com\/photo-1571019614242-c5c5dee9f50b[^"]*"/g,
    'src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop"'
);
content = content.replace(/src="https:\/\/images\.unsplash\.com\/photo-1552196563-55259259a545[^"]*"/g,
    'src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop"'
);
content = content.replace(/src="https:\/\/images\.unsplash\.com\/photo-1594824432258-454fa9156637[^"]*"/g,
    'src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop"'
);

fs.writeFileSync('rebuild_layouts_correctly.mjs', content, 'utf8');
console.log('Fixed URLs');
