import { useState } from 'react';

export default function ContactForm({ nextStep, handleFormDataChange }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    phoneNumber: '',
    contactMethod: '',
  });

  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: false }); // Clear the error for this field on change
    setFocusedField(field);
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = (field) => {
    if (!formData[field].trim()) setFocusedField(null);
  };

  const handleSubmit = () => {
    let newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field].trim()) newErrors[field] = true;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleFormDataChange({ contactInfo: formData });
      nextStep(); // Move to the next step
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg ">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label
            className={`text-sm ${focusedField === 'fullName' ? 'text-blue-600' : errors.fullName ? 'text-red-600' : formData.fullName ? 'text-[#5E6366]' : 'text-gray-700'}`}
          >
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            onFocus={() => handleFocus('fullName')}
            onBlur={() => handleBlur('fullName')}
            placeholder="Enter your full name"
            className={`mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB] ${focusedField === 'fullName' ? 'border-2 border-blue-600' : errors.fullName ? 'border-2 border-red-600' : formData.fullName ? 'border-[0.08rem] border-[#5E6366]' : 'border-0'}`}
          />
          {errors.fullName && <span className="text-red-500 text-sm">Fill the Box</span>}
        </div>
        <div>
          <label
            className={`text-sm ${focusedField === 'email' ? 'text-blue-600' : errors.email ? 'text-red-600' : formData.email ? 'text-[#5E6366]' : 'text-gray-700'}`}
          >
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onFocus={() => handleFocus('email')}
            onBlur={() => handleBlur('email')}
            placeholder="Enter your email address"
            className={`mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB] ${focusedField === 'email' ? 'border-2 border-blue-600' : errors.email ? 'border-2 border-red-600' : formData.email ? 'border-[0.08rem] border-[#5E6366]' : 'border-0'}`}
          />
          {errors.email && <span className="text-red-500 text-sm">Fill the Box</span>}
        </div>
        <div>
          <label
            className={`text-sm ${focusedField === 'address' ? 'text-blue-600' : errors.address ? 'text-red-600' : formData.address ? 'text-[#5E6366]' : 'text-gray-700'}`}
          >
            Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            onFocus={() => handleFocus('address')}
            onBlur={() => handleBlur('address')}
            placeholder="Enter your address"
            className={`mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB] ${focusedField === 'address' ? 'border-2 border-blue-600' : errors.address ? 'border-2 border-red-600' : formData.address ? 'border-[0.08rem] border-[#5E6366]' : 'border-0'}`}
          />
          {errors.address && <span className="text-red-500 text-sm">Fill the Box</span>}
        </div>
        <div>
          <label
            className={`text-sm ${focusedField === 'phoneNumber' ? 'text-blue-600' : errors.phoneNumber ? 'text-red-600' : formData.phoneNumber ? 'text-[#5E6366]' : 'text-gray-700'}`}
          >
            Phone Number
          </label>
          <div className="flex">
            <input
              type="text"
              value="+234"
              className="bg-gray-100 text-black p-2 rounded-l-md w-16 text-center outline-none h-12"
              readOnly
            />
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              onFocus={() => handleFocus('phoneNumber')}
              onBlur={() => handleBlur('phoneNumber')}
              placeholder="Enter your phone number"
              className={`mt-1 block w-full text-black rounded-r-md outline-none p-2 h-12 bg-[#F6F7FB] ${focusedField === 'phoneNumber' ? 'border-2 border-blue-600' : errors.phoneNumber ? 'border-2 border-red-600' : formData.phoneNumber ? 'border-[0.08rem] border-[#5E6366]' : 'border-0'}`}
            />
          </div>
          {errors.phoneNumber && <span className="text-red-500 text-sm">Fill the Box</span>}
        </div>
        <div className="col-span-2 flex justify-between items-center">
          <div className="w-1/2 mr-4">
            <label
              className={`text-sm ${focusedField === 'contactMethod' ? 'text-blue-600' : errors.contactMethod ? 'text-red-600' : formData.contactMethod ? 'text-[#5E6366]' : 'text-gray-700'}`}
            >
              Preferred Contact Method
            </label>
            <select
              value={formData.contactMethod}
              onChange={(e) => handleChange('contactMethod', e.target.value)}
              onFocus={() => handleFocus('contactMethod')}
              onBlur={() => handleBlur('contactMethod')}
              className={`mt-1 text-black block w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB] ${focusedField === 'contactMethod' ? 'border-2 border-blue-600' : errors.contactMethod ? 'border-2 border-red-600' : formData.contactMethod ? 'border-[0.08rem] border-[#5E6366]' : 'border-0'}`}
            >
              <option value="">Choose</option>
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
            </select>
            {errors.contactMethod && <span className="text-red-500 text-sm">Fill the Box</span>}
          </div>
          <button
            onClick={handleSubmit}
            className="bg-pink-500 text-white rounded-md px-6 py-2 mt-6 md:mt-0"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
