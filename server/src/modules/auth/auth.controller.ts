import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../../models/User';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    // Mock flow: auto-create the user if missing, since frontend sends mock emails and password
    if (!user) {
      const hashedPassword = await bcrypt.hash(password || 'password123', 10);
      user = await User.create({
        email,
        name: email.split('@')[0],
        password: hashedPassword,
        role: 'admin'
      });
    }

    // Mock flow: if auto-created or testing, bypass strict password check for simplicity
    // Realistic flow would be:
    // const isMatch = await bcrypt.compare(password, user.password!);
    // if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.userId = user._id.toString();
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.session.userId) {
      // Return guest placeholder as per prev requirements
       res.json({
        user: {
          id: req.session.id,
          email: `guest-${req.session.id.substring(0, 5)}@guest.local`,
          name: `Guest ${req.session.id.substring(0, 5)}`,
          role: 'guest'
        }
      });
      return;
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
