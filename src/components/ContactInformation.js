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
    const newErrors = {};
    for (const field in formData) {
      if (!formData[field].trim()) newErrors[field] = true;
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleFormDataChange({ contactInfo: formData }); // Pass form data to parent
      nextStep();
    }
  };
  const renderInputField = (label, field, placeholder, type = "text") => (
    <div>
      <label
        className={`text-sm ${focusedField === field ? 'text-blue-600' : errors[field] ? 'text-red-600' : formData[field] ? 'text-[#5E6366]' : 'text-gray-700'}`}
      >
        {label}
      </label>
      <input
        type={type}
        value={formData[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        onFocus={() => handleFocus(field)}
        onBlur={() => handleBlur(field)}
        placeholder={placeholder}
        className={`mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB] ${focusedField === field ? 'border-2 border-blue-600' : errors[field] ? 'border-2 border-red-600' : formData[field] ? 'border-[0.08rem] border-[#5E6366]' : 'border-0'}`}
      />
      {errors[field] && <span className="text-red-500 text-sm">Fill the Box</span>}
    </div>
  );

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <div className="grid grid-cols-2 gap-6">
        {renderInputField("Full Name", "fullName", "Enter your full name")}
        {renderInputField("Email Address", "email", "Enter your email address", "email")}
        {renderInputField("Address", "address", "Enter your address")}
        
        <div>
          <label className={`text-sm ${focusedField === 'phoneNumber' ? 'text-blue-600' : errors.phoneNumber ? 'text-red-600' : formData.phoneNumber ? 'text-[#5E6366]' : 'text-gray-700'}`}>
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
            <label className={`text-sm ${focusedField === 'contactMethod' ? 'text-blue-600' : errors.contactMethod ? 'text-red-600' : formData.contactMethod ? 'text-[#5E6366]' : 'text-gray-700'}`}>
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
