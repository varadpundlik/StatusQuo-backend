# import fitz  # PyMuPDF
# import difflib
# import openai
# import os
# from dotenv import load_dotenv

# load_dotenv()

# # Get API key from environment variable
# api_key = os.getenv("OPENAI_API_KEY")
# print(api_key)

# # Set your OpenAI API key
# openai.api_key = api_key

# def extract_text_from_pdf(pdf_path):
#   """Extract text from a PDF file using PyMuPDF."""
#   doc = fitz.open(pdf_path)
#   text = ""
#   for page in doc:
#     text += page.get_text()
#   return text

# def modify_doc1_with_doc2(doc1_path, doc2_path):
#   """Modify doc1 using reference from Project Documentation Guidelines and GPT-3."""
#   # Extract text from doc1 and Project Documentation Guidelines
#   doc1_text = extract_text_from_pdf(doc1_path)
#   doc2_text = extract_text_from_pdf(doc2_path)

#   # Perform text comparison to find differences
#   d = difflib.Differ()
#   diff = list(d.compare(doc1_text.splitlines(), doc2_text.splitlines()))

#   # Apply modifications to doc1 based on Project Documentation Guidelines using GPT-3
#   modified_text = ""
#   for line in diff:
#     if line.startswith('- '):
#       continue # Skip lines unique to doc1
#     elif line.startswith('+ '):
#       # Use GPT-3 to generate the modified line
#       prompt = f"Modify the following line: {line[2:]}"
#       response = openai.Completion.create(
#         engine="gpt-3.5-turbo-instruct",  # Recommended replacement for text-davinci-003
#         prompt=prompt,
#         max_tokens=50,
#             stop=None,  # Important safety precaution
#       )
#       modified_line = response.choices[0].text.strip()
#       modified_text += modified_line + '\n'
#     elif line.startswith(' '):
#       modified_text += line[2:] + '\n' # Add unchanged lines

#   # Write modified content to a new file or overwrite doc1
#   output_path = "output/modified_doc1.txt"
#   with open(output_path, 'w') as f:
#     f.write(modified_text)

#   print(f"Modified content saved to '{output_path}'")

# if __name__ == "__main__":
#   doc1_path = 'pdfs/doc1.pdf' # Path to your doc1 PDF file
#   doc2_path = 'pdfs/Project Documentation Guidelines.pdf' # Path to your Project Documentation Guidelines PDF file

#   modify_doc1_with_doc2(doc1_path, doc2_path)