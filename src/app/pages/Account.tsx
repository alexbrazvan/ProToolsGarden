import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, CreditCard, Package, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router';

const accountSections = [
  {
    icon: User,
    title: 'Profile Information',
    description: 'Manage your personal details',
    link: '#'
  },
  {
    icon: Package,
    title: 'Order History',
    description: 'View and track your orders',
    link: '#'
  },
  {
    icon: MapPin,
    title: 'Addresses',
    description: 'Manage shipping addresses',
    link: '#'
  },
  {
    icon: CreditCard,
    title: 'Payment Methods',
    description: 'Manage payment options',
    link: '#'
  },
  {
    icon: Settings,
    title: 'Account Settings',
    description: 'Privacy and preferences',
    link: '#'
  }
];

const recentOrders = [
  {
    id: 'ORD-2024-001',
    date: '2026-04-28',
    total: 459.97,
    status: 'Delivered',
    items: 3
  },
  {
    id: 'ORD-2024-002',
    date: '2026-04-15',
    total: 129.99,
    status: 'In Transit',
    items: 1
  },
  {
    id: 'ORD-2024-003',
    date: '2026-03-22',
    total: 789.98,
    status: 'Delivered',
    items: 5
  }
];

export function Account() {
  return (
    <div className="min-h-screen bg-secondary/20">
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">My Account</h1>
            <p className="text-xl opacity-90">Manage your profile and orders</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg p-6 border border-border">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User size={48} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-1">John Doe</h2>
                <p className="text-muted-foreground">john.doe@example.com</p>
              </div>

              <div className="space-y-3 border-t border-border pt-6">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={18} className="text-muted-foreground" />
                  <span>john.doe@example.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={18} className="text-muted-foreground" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={18} className="text-muted-foreground" />
                  <span>New York, NY 10001</span>
                </div>
              </div>

              <button className="w-full mt-6 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </motion.div>

          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {accountSections.map((section, index) => (
                  <motion.a
                    key={section.title}
                    href={section.link}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg p-6 border border-border hover:border-accent transition-all hover:shadow-md"
                  >
                    <section.icon size={32} className="text-accent mb-3" />
                    <h4 className="font-bold text-lg mb-1">{section.title}</h4>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-6">Recent Orders</h3>
              <div className="bg-white rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold">Order ID</th>
                        <th className="px-6 py-4 text-left text-sm font-bold">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-bold">Items</th>
                        <th className="px-6 py-4 text-left text-sm font-bold">Total</th>
                        <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-secondary/20 transition-colors">
                          <td className="px-6 py-4 font-medium">{order.id}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{order.date}</td>
                          <td className="px-6 py-4 text-sm">{order.items} items</td>
                          <td className="px-6 py-4 font-bold">${order.total.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              order.status === 'Delivered'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <a href="#" className="text-accent hover:text-accent/80 font-medium text-sm">
                              View Details
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
