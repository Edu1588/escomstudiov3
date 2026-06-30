import fs from 'fs';

let content = fs.readFileSync('rebuild_layouts_correctly.mjs', 'utf8');

// 1. Fix Oral Fix Broken Images
// Hero background works.
// "Tecnologia Oral Fix" broken:
content = content.replace(
    /https:\/\/images\.unsplash\.com\/photo-1614859324967-bdf31ce86910\?q=80&w=1200&auto=format&fit=crop/g,
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1200&auto=format&fit=crop'
);
// Fix the malformed src and onerror injections
content = content.replace(
    /src="https:\/\/images\.unsplash\.com\/photo-1598256989800-fea5ce5146f5[^"]*"(.*?)onerror="[^"]*"/g,
    'src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop"'
);
content = content.replace(
    /src="https:\/\/images\.unsplash\.com\/photo-1598256989800-fea5ce5146f5[^"]*"/g,
    'src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop"'
);

content = content.replace(
    /src="https:\/\/images\.unsplash\.com\/photo-1532153975070-2e9ab71f1b14[^"]*"(.*?)onerror="[^"]*"/g,
    'src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop"'
);
content = content.replace(
    /src="https:\/\/images\.unsplash\.com\/photo-1532153975070-2e9ab71f1b14[^"]*"/g,
    'src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop"'
);

content = content.replace(
    /src="https:\/\/images\.unsplash\.com\/photo-1606265752439-1f18756aa5fc[^"]*"(.*?)onerror="[^"]*"/g,
    'src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop"'
);
content = content.replace(
    /src="https:\/\/images\.unsplash\.com\/photo-1606265752439-1f18756aa5fc[^"]*"/g,
    'src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop"'
);


// 2. Add onerror correctly for Chiro (if it failed, replace entirely with working images)
content = content.replace(
    /src="https:\/\/images\.unsplash\.com\/photo-1544367567-0f2fcb009e0b[^"]*"(.*?)onerror="[^"]*"/g,
    'src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop"'
);
content = content.replace(
    /src="https:\/\/images\.unsplash\.com\/photo-1544367567-0f2fcb009e0b[^"]*"/g,
    'src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop"'
);

content = content.replace(
    /src="https:\/\/images\.unsplash\.com\/photo-1571019614242-c5c5dee9f50b[^"]*"(.*?)onerror="[^"]*"/g,
    'src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop"'
);
content = content.replace(
    /src="https:\/\/images\.unsplash\.com\/photo-1571019614242-c5c5dee9f50b[^"]*"/g,
    'src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop"'
);

content = content.replace(
    /src="https:\/\/images\.unsplash\.com\/photo-1552196563-55259259a545[^"]*"(.*?)onerror="[^"]*"/g,
    'src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop"'
);
content = content.replace(
    /src="https:\/\/images\.unsplash\.com\/photo-1552196563-55259259a545[^"]*"/g,
    'src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop"'
);

// Fix Elizabete image broken
content = content.replace(
    /src="https:\/\/images\.unsplash\.com\/photo-1594824432258-454fa9156637[^"]*"/g,
    'src="https://images.unsplash.com/photo-1614859324967-bdf31ce86910?q=80&w=800&auto=format&fit=crop"' // wait, 161485 is broken too? I'll use 1576091160550
);
content = content.replace(
    /src="https:\/\/images\.unsplash\.com\/photo-1594824432258-454fa9156637[^"]*"/g,
    'src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop"'
);

fs.writeFileSync('rebuild_layouts_correctly.mjs', content, 'utf8');
console.log('Script limpo com imagens fixadas.');
